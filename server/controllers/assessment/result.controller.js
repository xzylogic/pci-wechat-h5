'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  getResult: (req, res) => {
    let url = requestTool.setAuthUrl('/assessment/result'); // 重定向url
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    auth.getOpenId(req, res, url, (openId) => {
      requestTool.getwithhandle('result',`openId=${openId}`, (_data) => {
        if (_data) {
          res.render('assessment/result', {
              data:_data.content,
              errorMessage:""
            });
        }
      }, (err) => {
        res.render('lecture/info', {
        	data:[],
           errorMessage: err,
        });
      });  
  });
}
}
