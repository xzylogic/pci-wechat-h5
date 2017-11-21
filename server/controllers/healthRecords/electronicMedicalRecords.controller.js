'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {
  // 电子病历
	getEMR: (req, res) => {
		let url = requestTool.setAuthUrl('/EMR', '');
		auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(res, openId, (name) => {
        // 已登录跳转电子病历页面
        res.render('healthRecords/electronicMedicalRecords',{

        })
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=2`);
      });
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
	},

  // 绑定社保
  getSocialSecurity: (req, res) => {
    let url = requestTool.setAuthUrl('/bindingSocialSecurity', '');
    auth.getOpenId(req, res, url, (openId) => {
      res.render('healthRecords/bindingSocialSecurity',{

      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  }
}