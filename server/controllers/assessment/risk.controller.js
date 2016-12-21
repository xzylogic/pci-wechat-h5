'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {
  
  //  getLoad: (req,res) =>{
  //   // 测试写死cookie数据
  //   //auth.setCookies(res, 'pci_secret', 'ox0ThwmPe29gK2bl8v7cbr6Z-emg');
  //   auth.setCookies(res, 'pci_secret', 'ox0ThwtVjZiQMWLCx3SwupAqG4zk');
  //   // res.clearCookie('pci_secret');
  //   let url = requestTool.setAuthUrl('/assessment/risk'); // 重定向url
  // },
  
  getRisk: (req, res) => {
    auth.setCookies(res, 'pci_secret', 'ox0ThwtVjZiQMWLCx3SwupAqG4zk');
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    // auth.getOpenId(req, res, url , (openId)=>{
      res.render('assessment/risk');
    // });
    // if(openId){
    //    res.render('assessment/risk');
    // } else {
    //   res.redirect(`${global.config.root}/assessment/risk`);
    // }
  },

  riskVerify: (req, res) => {
      let postData = '';
      req.addListener('data', (data) => {
      postData += data;
    });
    req.addListener('end', () => {
      let data = querystring.parse(postData);
      let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
      data.openId = openId;
      requestTool.postwithhandle('risk', data, (_data) => {
        if (_data) {
          res.redirect(`${global.config.root}/assessment/result`);
        }
      }, (err) => {
        res.redirect(`${global.config.root}/assessment/result/enter?err=${err}`);
      })
    });
  }
}