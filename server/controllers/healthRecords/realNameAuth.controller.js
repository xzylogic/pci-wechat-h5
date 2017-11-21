'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {
  // 实名认证列表页面
	getAuthList: (req, res) => {
		let url = requestTool.setAuthUrl('/authlist', '');
		auth.getOpenId(req, res, url, (openId) => {
      res.render('healthRecords/authlist',{

			})
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
	},

  // 手机号认证页面
  getAuthPhone: (req, res) => {
    let url = requestTool.setAuthUrl('/authphone', '');
    auth.getOpenId(req, res, url, (openId) => {
      res.render('healthRecords/authphone',{

      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  },

  // 身份证认证页面
  getAuthCard: (req, res) => {
    let url = requestTool.setAuthUrl('/authcard', '');
    auth.getOpenId(req, res, url, (openId) => {
      res.render('healthRecords/authcard',{

      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  }
}