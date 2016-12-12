'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  getView: (req, res) => {

    console.log(req.signedCookies);
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    let code = req.query.code || ''; // 微信返回code

    if (openId) {
      console.log(openId);
      res.clearCookie('pci_secret');
      res.render('basic/login');

    } else if (code) {
      console.log(`Login Code: ${code}`);

      // auth.getToken(res, code, (data) => {
      //   console.log(data);
      //   auth.setCookies(res, 'pci_secret', JSON.parse(data).openid);

        res.render('basic/login');

      // })

    } else {
      let url = requestTool.setAuthUrl('/login', 'login'); // 重定向url
      console.log(url);
      // res.send(url);
      res.redirect(url);
    }
  },

  loginVerify: (req, res) => {
    let postData = '';

    req.addListener('data', (data) => {
      postData += data;
    });

    req.addListener('end', () => {
      let verifyData = querystring.parse(postData);
      console.log(`POST login/verify ${JSON.stringify(verifyData)}`);

      if (type == 1) {
        res.render('basic/login-enter', {
          postUrl: `/verify/${verifyData.tel}`,
          errorMessage: ''
        });
      } else if (type == 2) {
        res.render('basic/login-register', {
          postUrl: `/register/${verifyData.tel}`,
        });
      }

    });
  },

  login: (req, res) => {
    let tel = req.params.tel;
    console.log(`Login info: { tel: ${tel} }`);
    var postData = '';

    req.addListener('data', (data) => {
      postData += data;
    });

    req.addListener('end', () => {
      let codeData = querystring.parse(postData);
      console.log(`POST login ${JSON.stringify(codeData)}`);

      requestTool.get(res, 'verify', codeData, (_data) => {
        if (JSON.parse(_data).code == 0) {
          res.render('basic/login-success', {
            status: '登录',
            username: '李四'
          });
        } else {
          console.log(`User ${tel} login failed!`);
          res.render('basic/login-enter', {
            postUrl: `/verify/${tel}`,
            errorMessage: '验证码错误！'
          });
        }
      })
    });
  },

  verify: (req, res) => {
    let code = req.query.code;
    if (code == 1234) {
      res.send({ code: 0 });
    } else {
      res.send({ code: -1 })
    }
  },

  register: (req, res) => {

  },


  getSuccess: (req, res) => {
    res.render('basic/login-success', {
      status: '登录',
      username: '李四'
    });
  },

}
