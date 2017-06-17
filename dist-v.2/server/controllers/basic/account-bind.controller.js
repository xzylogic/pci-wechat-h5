'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  // 获取账号绑定页面
  getAccountBind: (req, res) => {
    // auth.setCookies(res, 'pci_secret', 'ox0ThwmPe29gK2bl8v7cbr6Z-emg');
    let url = requestTool.setAuthUrl('/family', ''); // 重定向url

    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(res, openId, (name) => {
        requestTool.getwithhandle('familyApply', `openId=${openId}`, (data) => {
          res.render('basic/account-bind', {
            content: data.content
          });
        }, (err) => {
          res.render('error', {
            message: '请求错误'
          })
        });
      }, () => {
        res.redirect(`${global.config.root}/login?status=2`);
      });
    });
  },

  // 获取添加绑定账号页面
  getAccountBindAdd: (req, res) => {
    let errorMessage = req.query.errorMessage || '';
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId

    if (openId) {
      res.render('basic/account-bind-add', {
        postUrl: '/family/add',
        errorMessage: errorMessage
      });
    } else {
      res.redirect(`${global.config.root}/family`);
    }
  },

  // 绑定账号
  bindAccount: (req, res) => {
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    let postData = ''; // 记录form表单提交的数据

    if (openId && req.method.toLowerCase() === 'post') {
      req.addListener('data', (data) => {
        postData += data;
      });

      req.addListener('end', () => {
        let bindData = querystring.parse(postData);
        bindData.openId = openId;
        console.log(`[${new Date()}] POST /login : ${JSON.stringify(bindData)}`);
        requestTool.postwithhandle('familyApply', bindData, (result) => {
          res.redirect(`${global.config.root}/family`);
        }, (error) => {
          res.redirect(`${global.config.root}/family/add?errorMessage=${error}`);
        });
      });
    }
  },

  // 通过手机号查找账号信息
  getAccountSearch: (req, res) => {
    var tel = req.query.tel || '';
    requestTool.getApi(res, 'familySearch', `tel=${tel}`, (data) => {
      res.send(data);
    });
  },

}
