'use strict';

var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {
  // 实名认证列表页面
	getAuthList: (req, res) => {
    auth.setCookies(res, 'pci_secret', 'ovMkVwH6ldi-JOG4tdiVqcLJmR5s');
		let url = requestTool.setAuthUrl('/authlist', '');
    let authList = req.query.auth || '';
		auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) =>{
        res.render('healthRecords/authlist',{
          auth: authList
        })
      },() =>{
        res.redirect(`${global.config.root}/login?status=5`);
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
    let tel = req.signedCookies.phone || '';// 从cookie中找手机号
    let certification = req.query.auth || '';
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) =>{
        res.render('healthRecords/authphone',{
          url: global.config.userServer,
          tel: tel,
          auth: certification
        })
      },() =>{
        res.redirect(`${global.config.root}/login?status=5`);
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
          userId: data.userId,
          url: global.config.userServer
        })
      },() =>{
        res.redirect(`${global.config.root}/login?status=5`);
      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  }
}

