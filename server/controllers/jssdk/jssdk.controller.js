'use strict';
var sign = require('./sign.js');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

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
  }
}
