'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');

module.exports = {

  getView: (req, res) => {
    let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx47391e9ef8958539&redirect_uri=http%3A%2F%2F139.224.186.36%2Fpci-wechat-test%2Flogin%2F1&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
    let type = req.params.type;
    let code = req.query.code;
    if(code){
      console.log(`Login Type: ${type}`);
      res.render('basic/login', {
        postUrl: '/login/' + type,
      });
    } else {
      res.redirect(url);
    }
    
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
    console.log(`Login info: { tel: ${tel}, type: ${type}`);
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
