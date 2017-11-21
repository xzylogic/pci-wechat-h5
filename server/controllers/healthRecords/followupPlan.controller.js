'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {
  // 随访计划列表
	getfollowupPlan: (req, res) => {
		let url = requestTool.setAuthUrl('/followUp', '');
		auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(res, openId, (name) => {
        // 已登录跳转随访计划页面
        res.render('healthRecords/followupPlan',{

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
  // 随访计划详情
  getfollowupPlanDetail: (req, res) => {
    let url = requestTool.setAuthUrl('/followUpDetail', '');
    auth.getOpenId(req, res, url, (openId) => {
      res.render('healthRecords/followupPlanDetail',{

      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  },

  //随访计划反馈
  getFollowFeedback: (req, res) => {
    let url = requestTool.setAuthUrl('/followfeedback', '');
    auth.getOpenId(req, res, url, (openId) => {
      res.render('healthRecords/followfeedback',{

      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  },

  //随访计划链接失效
  getFollowFailure: (req, res) => {
    let url = requestTool.setAuthUrl('/followfailure', '');
    auth.getOpenId(req, res, url, (openId) => {
      res.render('healthRecords/followfailure',{

      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  }

}