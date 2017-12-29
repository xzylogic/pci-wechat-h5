'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {
 //上传图片页面
	getCaseHistory: (req, res) => {
		let url = requestTool.setAuthUrl('/uploadCaseHistory', '');
		auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) => {
        // 已登录跳转上传病历页面
        res.render('healthRecords/uploadCaseHistory',{
          access_token: data.access_token,
          healthUrl: global.config.healthServer,
          url: global.config.userServer,
          qiniuUrl: global.config.server,
          userId: data.userId
        })
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=1`);
      });
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
	}
}