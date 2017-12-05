'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {
  // 电子病历
	getEMR: (req, res) => {
		let url = requestTool.setAuthUrl('/EMR', '');
		auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) =>{
        // 已登录验证是否实名认证
        requestTool.getHeader('certificationStatus', data.access_token, `userId=${data.userId}`, (_data) => {
          if (_data.code === 0 && _data.data && _data.data.status === 1) {
            requestTool.getHealthClient(`${global.config.healthServer}record/history/list/${data.userId}?form=1`, '', (_res) => {
              // console.log(_res.data.content)
              if (_res.code === 0 && _res.data.content.length !== 0) {
                // 已实名认证跳转到电子病历页面
                res.render('healthRecords/electronicMedicalRecords', {
                  data: _res.data.content,
                  status: true
                })
              } else if (_res.code === 0 && _res.data.content.length === 0) {
                res.render('healthRecords/electronicMedicalRecords', {
                  status: false
                })
              } else {
                res.render('error', {
                  message: '未知错误'
                });
              }
            }, (err) => {
              res.render('error', {
                message: err
              });
            })
          } else if (_data.code === 403) {
            // Token过期或者错误跳转到登录页，并清除cookie
            res.clearCookie('accessToken');
            res.clearCookie('userId');
            res.redirect(`${global.config.root}/login?status=2`);
          } else {
            // 未认证跳转到实名认证页面
            res.redirect(`${global.config.root}/authlist`);
          }
        }, (err) =>{
          res.render('error', {
            message: err
          });
        })
      },() =>{
        res.redirect(`${global.config.root}/login?status=2`);
      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
	},

  // 绑定社保页面
  getSocialSecurity: (req, res) => {
    let url = requestTool.setAuthUrl('/bindingSocialSecurity', '');
    let name;
    let card;
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) => {
        requestTool.getHeader('certificationStatus', data.access_token, `userId=${data.userId}`, (_data) => {
          if (_data.code === 0 && _data.data && _data.data.status === 1) {
            name = _data.data.name
            card = _data.data.card
            if (name && name.length === 2) {
              name = name.substring(0, 1) + "*"
            }
            if (name && name.length === 3) {
              name = name.substring(0, 1) + "*" + name.substring(2)
            }
            if (name && name.length === 4) {
              name = name.substring(0, 1) + "**" + name.substring(3)
            }
            if (card && card.length === 18) {
              card = card.substring(0,4) + '********' +card.substring(14)
            }
            if (card && card.length === 15) {
              card = card.substring(0,4) + '*****' +card.substring(11)
            }
          }
          // 已登录跳转绑定社保页面
          res.render('healthRecords/bindingSocialSecurity',{
            name: name,
            card: card
          })
        }, (err) =>{
          // 请求出错仍进页面，不显示姓名和身份证号
          res.render('healthRecords/bindingSocialSecurity',{
            name: '',
            card: ''
          })
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

  //绑定社保接口
  getSocialSecurityApi: (req, res) => {
    let cardNumber = req.query.cardNumber || '';
    let userId = req.signedCookies.userId || '';
    let access_token = req.signedCookies.accessToken || '';
    let data = {
      medicareCard: cardNumber,
      userId: userId
    }
    requestTool.postHeader('bindMedicareCard', access_token, data, (_data) => {
        if (_data) {
          res.send(_data);
        }
      }, (err) => {
        res.send(err);
      })
  }
}