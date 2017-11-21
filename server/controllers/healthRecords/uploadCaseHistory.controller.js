'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

	getCaseHistory: (req, res) => {
		let url = requestTool.setAuthUrl('/uploadCaseHistory', '');
		auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(res, openId, (name) => {
        // 已登录跳转上传病历页面
        res.render('healthRecords/uploadCaseHistory',{

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
	},

  getImg: (req, res) => {
    res.render('assessment/img',{

    })
  }
}