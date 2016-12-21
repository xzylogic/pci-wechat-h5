'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  getRisk: (req, res) => {
    let url = requestTool.setAuthUrl('assessment/risk', ''); // 重定向url
    // auth.setCookies(res, 'pci_secret', 'ox0ThwtVjZiQMWLCx3SwupAqG4zk');
    auth.getOpenId(req, res, url, (openId) => {
      res.render('assessment/risk');
    });
  },

  // 提交风险评估接口
  riskVerify: (req, res) => {
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    if (openId) {
      let postData = req.body;
      postData.openId = openId;
      console.log(`[${new Date()}] Risk Post Data: ${JSON.stringify(postData)}`);
      requestTool.postApi(res, 'risk', postData, (_data) => {
        res.send(_data);;
      });
    } else {
      res.redirect(`${global.config.root}/assessment/risk`);
    }
  }
}
