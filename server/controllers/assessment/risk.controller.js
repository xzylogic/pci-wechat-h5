'use strict';

var requestTool = require('../common/request-tool');

module.exports = {

  getRisk: (req, res) => {
    // requestTool.get(res, 'test', req.query, (data) => {
    //   console.log(data);
      res.render('assessment/risk');
    // })
  },


// 获取登录验证码接口
  getLoginVerifyCode: (req, res) => {
    let tel = req.query.tel;
    requestTool.getApi(res, 'getLoginCode', `tel=${tel}`, (data) => {
      res.send(data);
    });
  },
}