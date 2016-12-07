'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');

module.exports = {

  getView: (req, res) => {
    let type = req.params.type;
    console.log(`Login Type: ${type}`);
    res.render('basic/login', {
      postUrl: '/login/' + type,
    });
  },

  loginVerify: (req, res) => {
    let type = req.params.type;
    let postData = '';

    req.addListener('data', (data) => {
      postData += data;
    });

    req.addListener('end', () => {
      let verifyData = querystring.parse(postData);
      console.log(`POST login/verify ${JSON.stringify(verifyData)}`);

      if (type == 1) {
        res.render('basic/login-enter', {
          postUrl: `/verify/${type}/${verifyData.tel}`,
          errorMessage: ''
        });
      } else if (type == 2) {
        res.render('basic/login-register', {
          postUrl: `/register/${type}/${verifyData.tel}`,
        });
      }

    });
  },

  login: (req, res) => {
    let type = req.params.type;
    let tel = req.params.tel;
    console.log(`Login Info: { tel: ${tel}, type: ${type}`);
    var postData = '';

    req.addListener('data', (data) => {
      postData += data;
    });

    req.addListener('end', () => {
      let codeData = querystring.parse(postData);
      console.log(`POST login ${JSON.stringify(codeData)}`);

      requestTool.get(res, 'verify', codeData, (_data) => {
        console.log(JSON.parse(_data).code);
        if (JSON.parse(_data).code == 0) {
          res.render('basic/login-success', {
            status: '登录',
            username: '李四'
          });
        } else {
          console.log('Login Fail!');
          res.render('basic/login-enter', {
            postUrl: `/verify/${type}/${tel}`,
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
