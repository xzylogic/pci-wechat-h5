'use strict';
var querystring = require('querystring');
var sign = require('./sign.js');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  getFather: (req, res) => {
    var qrCode = req.query.qrCode || '';
    var share = req.query.share || '';
    // auth.setCookies(res, 'pci_secret', 'ovMkVwCVm__t7PODaLbA0r5ZkIAw');
    let url = requestTool.setAuthInfoUrl('/father/father');// 重定向url
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    if(openId){
      getHomePage(openId);
      if(qrCode){
        QRcode(openId);
      }
    }else{
       auth.getOpenId(req, res, url, (openId) => {
        getHomePage(openId);
        if(qrCode){
          QRcode(openId);
        }       
      });
    };
   
    //统计页面访问量和独立访客数
    function getHomePage(openId){
      res.render('father/father');
      requestTool.getStatistics('statistics',`openId=${openId}&type=0`,(_result) => {
        if(_result.code == 0){
          console.log("页面访问量");
        }
      });
      requestTool.getStatistics('statistics',`openId=${openId}&type=1`,(_result) => {
        if(_result.code == 0){
          console.log("独立访客数");
        } 
      });
      if(share){
        requestTool.getStatistics('statistics',`openId=${openId}&type=5`,(_result) => {
          if(_result.code == 0){
            console.log("页面分享转发人数");
          }
        });
      }
    };


    //统计扫描二维码数量和人数
    function QRcode(openId){
      requestTool.getStatistics('statistics',`openId=${openId}&type=2`,(_result) => {
        if(_result.code == 0){
          console.log("二维码扫码数量");
        }
      });
      requestTool.getStatistics('statistics',`openId=${openId}&type=3`,(_result) => {
        if(_result.code == 0){
          console.log("二维码扫码人数");
        } 
      }); 
    };
  },


  getMakeGreetingCard: (req,res) => {
    let url = requestTool.setAuthUrl('/father/make-greetingCard');// 重定向url
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    if(openId){
      res.render('father/make-greetingCard');
    }else{
      auth.getOpenId(req, res, url, (openId) => {
       res.render('father/make-greetingCard');
      });
    }
  },


  getSharePage: (req,res) => {
    let url = requestTool.setAuthUrl('/father/make-greetingCard');// 重定向url
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    var img = "";
    var appellation = req.query.appellation || '';
    var content = req.query.content || "";
    var signature = req.query.signature || "";
    var id = req.query.id || "";
    if(id == 1){
      img = '/father-1_03.png';
    }else if( id == 2){
      img = '/father-02.png';
    }else if(id == 3){
      img = '/father_03.png';
    }else{
      img = '/timg.jpg';
    };
    if(openId){
      res.render('father/Share-page', {
        appellation:appellation,
        content:content,
        signature:signature,
        img:img
      });
    }else{
      auth.getOpenId(req, res, url, (openId) => {
        res.render('father/Share-page', {
          appellation:appellation,
          content:content,
          signature:signature,
          img:img
        });
      });
    }
  },


  getSignature: (req,res) => {
    let ticket = req.signedCookies.jsapi_ticket || ''; // 从cookie中找jsapi_ticket;
    var url = req.body.url || '';
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
            console.log("请求jsapi_ticket失败");
        })
          
      },err =>{
          console.log("请求access_token失败");
      })
    }
  },


  getTranspond: (req,res) => {
    let openId = req.signedCookies.pci_secret || '';// 从cookie中找openId
    requestTool.getStatistics('statistics',`openId=${openId}&type=4`,(_result) => {
        if(_result.code == 0){
          console.log("页面分享转发次数");
          res.send("页面分享成功");
        }
    });
  }

}
