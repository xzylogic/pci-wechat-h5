'use strict';

var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {
  // 随访计划列表
	getfollowupPlan: (req, res) => {
		let url = requestTool.setAuthUrl('/followUp', '');
		auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) => {
        requestTool.getHeader('flupList', data.access_token, `userId=${data.userId}`, (_data) =>{
          if (_data && _data.code === 0 && _data.data.myFlupList.length === 0) {
            res.render('healthRecords/followupPlan',{
              myFlupList: [],
              "json": [],
              status: false
            })
          } else if (_data && _data.code === 0 && _data.data.myFlupList.length !== 0 && _data.data.myFlupList.length !== 1) {
            // 已登录跳转随访计划列表页面
            res.render('healthRecords/followupPlan',{
              myFlupList: _data.data.myFlupList,
              "json": _data.data.myFlupList,
              status: true
            })
          } else if (_data && _data.code === 0 && _data.data.myFlupList.length === 1) {
            res.redirect(`${global.config.root}/followUpDetail?doctorId=${_data.data.myFlupList[0].doctorId}`);
          } else if (_data && _data.code === 403) {
            // Token过期或者错误跳转到登录页，并清除cookie
            res.clearCookie('accessToken');
            res.clearCookie('userId');
            res.redirect(`${global.config.root}/login?status=3`);
          } else {
            res.render('error', {
              message: _data.msg || '未知错误'
            });
          }
        }, (error) => {
          res.render('error', {
            message: error
          });
        })

      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=3`);
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
    let doctorId = req.query.doctorId || '';
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) => {
        if (doctorId) {
          let postData = {
            doctorId: doctorId,
            userId: data.userId
          }
          requestTool.postHeader('flupDetail', data.access_token, postData, (_data) =>{
            if (_data && _data.code === 0) {
              res.render('healthRecords/followupPlanDetail',{
                flupDetail: _data.data
              })
            } else if (_data && _data.code === 403) {
              res.clearCookie('accessToken');
              res.clearCookie('userId');
              res.redirect(`${global.config.root}/login?status=3`);
            } else {
              res.render('error', {
                message: _data.msg || '参数异常'
              });
            }
          }, (error) => {
            res.render('error', {
                message: '接口请求错误'
            });
          })
        } else {
          res.render('error', {
            message: '参数异常'
          });
        }
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=3`);
      });
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  },

  //随访计划反馈
  getFollowFeedback: (req, res) => {
    let fbId = req.query.fbId || 1;
    let otherRemind = req.query.otherRemind || '';
    let feedbackTimes = req.query.feedbackTimes || '';
    let dn = req.query.feedbackTimes || '';
    let url = requestTool.setAuthUrl('/followfeedback', '');
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) => {
        requestTool.getHeaderUrl(`api/doctorPatient/flup/feedback/find/${fbId}`, data.access_token, '', (_data) =>{
          console.log(_data)
          if (_data.code === 0 && _data.data.plan && _data.data.plan.length !== 0 && _data.data.firstPushStatus === true) {
            res.render('healthRecords/followfeedback',{
              plan: _data.data.plan,
              item: _data.data.item,
              otherRemind: otherRemind,
              feedbackTimes: feedbackTimes,
              flupFeedbackId: fbId,
              dn: dn,
              url: global.config.userServer,
              access_token: data.access_token
            })
          } else if (_data.code === 0 && _data.data.firstPushStatus === null || _data.data.firstPushStatus === false) {
              res.redirect(`${global.config.root}/followfailure`);
          } else if (_data.code === 403) {
            res.clearCookie('accessToken');
            res.clearCookie('userId');
            res.redirect(`${global.config.root}/login?status=6`);
          } else {
            res.render('error', {
              message: _data.msg || '未知错误'
            });
          }
        }, (error) => {
          res.render('error', {
            message: error
          });
        })
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=6`);
      });
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