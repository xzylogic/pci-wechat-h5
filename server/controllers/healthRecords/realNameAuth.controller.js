'use strict';

var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {
  // 实名认证列表页面
	getAuthList: (req, res) => {
		let url = requestTool.setAuthUrl('/authlist', '');
		auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) =>{
        res.render('healthRecords/authlist')
      },() =>{
        res.redirect(`${global.config.root}/login?status=6`);
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
      auth.isLogin(req, (data) =>{
        res.render('healthRecords/authphone',{

        })
      },() =>{
        res.redirect(`${global.config.root}/login?status=6`);
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
      auth.isLogin(req, (data) =>{
        res.render('healthRecords/authcard',{
          access_token: data.access_token,
          url: global.config.userServer
        })
      },() =>{
        res.redirect(`${global.config.root}/login?status=6`);
      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  }
}

