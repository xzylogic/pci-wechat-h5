'use strict';

var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {
  /**
   * 实名认证列表页面
   * @param authList  点击电子病历时没有认证跳转过来的参数
   */
	getAuthList: (req, res) => {
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

  /**
   * 手机号认证列表页面
   * @param certification  点击电子病历时没有认证跳转过来的参数
   * @param tel  从cookie中找手机号
   */
  getAuthPhone: (req, res) => {
    let url = requestTool.setAuthUrl('/authphone', '');
    let tel = req.signedCookies.phone || '';
    let certification = req.query.auth || '';
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) =>{
        res.render('healthRecords/authphone',{
          url: global.config.userServer,
          tel: tel,
          auth: certification,
          userId: data.userId,
          access_token: data.access_token
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
          url: global.config.userServer,
          qiniuUrl: global.config.server
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

