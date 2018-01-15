'use strict';
var sign = require('./sign.js');
var qiniu = require('qiniu');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');
var files = require('./files.js');

const mac = new qiniu.auth.digest.Mac('0FXtIZmQY4LIOvxLEj3waLbNWhz9U66S-ahMnCfi', 'qPRpHcCr4MjykNJqXDo7cZXG_NGWCRkc00iifwRo');
var config = new qiniu.conf.Config();
var bucketManager = new qiniu.rs.BucketManager(mac, config);

module.exports = {
  /*
  * 获取JSSDK配置信息
  * 将获取到的access_token和jsapi_ticket存入到本地json文件中，判断写入的时间和当前时间差超过7000秒再重新获取
  */
  getSignature: (req,res) => {
    var url = req.query.url || '';
    var date = new Date().getTime();
    // var accdata = {};
    var jsapidata = {};
    // accdata.grant_type ="client_credential";
    // accdata.appid = global.config.appId;
    // accdata.secret = global.config.secret;
    jsapidata.type = "jsapi";
    jsapidata.access_token = "";
    files.readFile(req, res, 'jsapi_ticket', (ticket) => {
      if (Number(ticket.date) + 7000000 > date) {
        let signature = sign(ticket.jsapi_ticket,url); //签名算法
        res.send({
          appId:global.config.appId,
          nonceStr:signature.nonceStr,
          timestamp:signature.timestamp,
          signature:signature.signature,
        })
      } else {
        requestTool.getAccessToken((_data) => {
          files.writtenFile("access_token", _data.data);
          jsapidata.access_token = _data.data;
          requestTool.getJsapiTicket(jsapidata,(_res) =>{
            if (_res.ticket) {
              files.writtenFile("jsapi_ticket", _res.ticket);
              let signature = sign(_res.ticket,url); //签名算法
              res.send({
                appId:global.config.appId,
                nonceStr:signature.nonceStr,
                timestamp:signature.timestamp,
                signature:signature.signature,
              })
            } else {
              res.send({
                msg: 'access_token过期或无效'
              })
            }
          }, err =>{
              res.send("请求jsapi_ticket失败");
          })
        },err =>{
            res.send("请求access_token失败");
        })
      }
    }) 
  },

  // token过期，清除cookie,重新登录
  resetLogin: (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('userId');
    res.send({
      code: 0
    })
  },
   // 上传图片
  uploadImg: (req, res) => {
    let postData = '';

    req.addListener('data', (data) => {
      postData += data;
    });

    req.addListener('end', () => {
      let data = JSON.parse(postData);
      var imgUrl;
      requestTool.getAccessToken((_data) => {
        var access_token = _data.data
        let randomName = 'image'+Date.now()+ String(Math.random()).substring(3)+'.jpg';
        let url = `https://api.weixin.qq.com/cgi-bin/media/get?access_token=${access_token}&media_id=${data}`
        bucketManager.fetch(url, 'fw-pci', randomName, function(err, respBody, respInfo) {
          if (err) {
            res.send({
              code: -1,
              err: err
            })
            //throw err;
          } else {
            if (respInfo.statusCode == 200) {
              imgUrl = 'http://qn.qcxin.com/' + respBody.key //生成图片的可访问url
              res.send({
                code: 0,
                imgurl: imgUrl
              })
            } else {
              console.log(respInfo.statusCode);
              console.log(respBody);
            }
          }
        });
      },err =>{
        console.log("请求access_token失败");
      })
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