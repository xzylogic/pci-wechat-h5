'use strict';
var sign = require('./sign.js');
var qiniu = require('qiniu');
var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

const mac = new qiniu.auth.digest.Mac('-2XbyF-pdeF2-GzHjwFaH9NpS0hPdokr5u0b_jsB', '-Lo30ImxO3qNoEJrwjXJn0N_oSw4cusqNl1Cz1O6');
var config = new qiniu.conf.Config();
var bucketManager = new qiniu.rs.BucketManager(mac, config);

module.exports = {
  // 获取JSSDK配置信息
  getSignature: (req,res) => {
    let ticket = req.signedCookies.jsapi_ticket || ''; // 从cookie中找jsapi_ticket;
    let url = req.query.url || '';
    let accdata = {};
    var jsapidata = {};
    accdata.grant_type ="client_credential";
    accdata.appid = global.config.appId;
    accdata.secret = global.config.secret;
    jsapidata.type = "jsapi";
    jsapidata.access_token = "";
    if(ticket){
      let signature = sign(ticket,url); //签名算法
      res.send({
        appId:global.config.appId,
        nonceStr:signature.nonceStr,
        timestamp:signature.timestamp,
        signature:signature.signature,
      })
    }else{
      requestTool.getAccessToken(accdata,(_data) => { //获取access_token
        auth.setJsCookies(res, 'token', _data.access_token);
        jsapidata.access_token = _data.access_token;
        requestTool.getJsapiTicket(jsapidata,(_res) =>{//获取jsapi_ticket
          auth.setJsCookies(res, 'jsapi_ticket', _res.ticket);//储存jsapi_ticket
          let signature = sign(_res.ticket,url); //签名算法
          res.send({
            appId:global.config.appId,
            nonceStr:signature.nonceStr,
            timestamp:signature.timestamp,
            signature:signature.signature,
          })
        }, err =>{
            res.send("请求jsapi_ticket失败");
        })
          
      },err =>{
          res.send("请求access_token失败");
      })
    }
  },

  // token过期，清除cookie,重新登录
  resetLogin: (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('userId');
    res.send({
      code: 0
    })
  },

  getImg: (req, res) => {
    res.render('assessment/img')
  },

   // 上传图片
  uploadImg: (req, res) => {
    let token = req.signedCookies.token || ''; // 从cookie中找access_token;

    let postData = '';

    req.addListener('data', (data) => {
      postData += data;
    });

    req.addListener('end', () => {
      let data = JSON.parse(postData);
      var url;
      console.log(postData)
      var imgUrl = [];
      var randomName;
      for (let i = 0; i < data.length; i++) {
        randomName = 'image'+Date.now()+ String(Math.random()).substring(3)+'.jpg';
        if (token) {
          url = `https://api.weixin.qq.com/cgi-bin/media/get?access_token=${token}&media_id=${data[i]}`
          bucketManager.fetch(url, 'baoxiu', randomName, function(err, respBody, respInfo) {
            if (err) {
              console.log(err);
              //throw err;
            } else {
              if (respInfo.statusCode == 200) {
                imgUrl.push('http://oyf5a8fu2.bkt.clouddn.com/' + respBody.key); //生成图片的可访问url
                if (imgUrl.length === data.length){
                  console.log(imgUrl)
                  res.send({
                    imgurl: imgUrl
                  })
                }
              } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
              }
            }
          });
        }
      }
    })
  },


  // 分享网页
  getShare: (req, res) => {
    let url = requestTool.setAuthUrl('/share', '');
    auth.getOpenId(req, res, url, (openId) => {
      res.render('share/share')
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  }
}