'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  // 登录入口页面
  // 登录4种status状态
  // 0 登录 1 讲座报名 2 家庭账号绑定 3 讲座报名信息
  getLogin: (req, res) => {
    auth.setCookies(res, 'pci_secret', 'ox0ThwmPe29gK2bl8v7cbr6Z-emg');
    console.log(`[${new Date()}] Cookies: ${JSON.stringify(req.signedCookies)}`);
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    let code = req.query.code || ''; // 微信返回code
    let status = req.query.status || 0; // status状态数据

    auth.isLogin(res, openId, (name) => {
      res.redirect(`${global.config.root}/login/success?name=${name}`);
    }, () => {
      if (openId) {
        // 如果cookie中有openId 则直接渲染到登录入口页面

        res.render('basic/login', {
          status: status,
          errorMessage: ''
        });

      } else if (code) {
        // 如果是调用微信接口返回的code 则使用code获取openId后在cookie中储存 再渲染到登录入口页面

        console.log(`[${new Date()}] Login Code: ${code}`);
        // 正式接口调用
        auth.getToken(res, code, (data) => {
          console.log(data.openid);
          auth.setCookies(res, 'pci_secret', data.openid);
          res.render('basic/login', {
            status: status,
            errorMessage: ''
          });
        });

        // 自用测试调用 
        // auth.getTokenCopy(res, code, (data) => {
        //   auth.setCookies(res, 'pci_secret', data.openid);
        //   res.render('basic/login', {
        //     errorMessage: ''
        //   });
        // });

      } else {
        // 如果没有openId和code 则重定向到微信接口获取code

        let url = requestTool.setAuthUrl('/login', status); // 重定向url
        console.log(`[${new Date()}] Redirect Url: ${url}`);
        res.redirect(url);
      }
    });
  },

  // 登录验证页面
  getLoginEnter: (req, res) => {
    let tel = req.query.tel;
    let errorMessage = req.query.errorMessage || '';
    let status = req.query.status; // status状态数据

    res.render('basic/login-enter', {
      postUrl: `/login/verify?tel=${tel}&status=${status}`,
      errorMessage: errorMessage,
      tel: tel
    });
  },

  // 注册验证页面
  getRegister: (req, res) => {
    let tel = req.query.tel;
    let errorMessage = req.query.errorMessage || '';
    let status = req.query.status; // status状态数据
    res.render('basic/login-register', {
      postUrl: `/register?tel=${tel}&status=${status}`,
      errorMessage: errorMessage,
      tel: tel
    });
  },

  // 登录成功页面
  getLoginSuccess: (req, res) => {
    let name = req.query.name;
    console.log(`[${new Date()}] Login UesrName: ${name}`);
    res.render('basic/login-success', {
      username: name
    });
  },

  // 判断用户是否已注册
  // 若注册过则跳转到登录页面
  // 若未注册就跳转到注册页面
  login: (req, res) => {

    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    let status = req.query.status; // status状态数据
    let postData = ''; // 记录form表单提交的数据

    // 获取POST提交数据
    if (openId && req.method.toLowerCase() === 'post') {
      req.addListener('data', (data) => {
        postData += data;
      });

      req.addListener('end', () => {
        let tel = querystring.parse(postData).tel || '';
        console.log(`[${new Date()}] POST /login : ${JSON.stringify(querystring.parse(postData))}`);

        // 请求接口判断用户是否注册过
        requestTool.getwithhandle('ifRegister', postData, (result) => {
          if (result) {
            // 未注册 跳转到注册页面
            res.redirect(`${global.config.root}/register?tel=${tel}&status=${status}`);
            // res.render('basic/login-register', {
            //   postUrl: `/register?${postData}`,
            //   errorMessage: '',
            //   tel: tel
            // });
          } else {
            // 注册过 跳转到登录页面
            res.redirect(`${global.config.root}/login/enter?tel=${tel}&status=${status}`);
            // res.render('basic/login-enter', {
            //   postUrl: `/login/verify?${postData}`,
            //   errorMessage: '',
            //   tel: tel
            // });
          }
        }, (err) => {
          // 错误 重新返回页面
          res.render('basic/login', {
            status: status,
            errorMessage: err
          });
        });
      });
    }
  },

  // 获取验证码后登录操作
  loginVerify: (req, res) => {
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    let tel = req.query.tel;
    let status = req.query.status; // status状态数据
    console.log(`[${new Date()}] Login User: { tel: ${tel}, openId: ${openId}, status: ${status} }`);
    let postData = '';

    req.addListener('data', (data) => {
      postData += data;
    });

    req.addListener('end', () => {
      let data = querystring.parse(postData);
      console.log(`[${new Date()}] Login VerifyCode: ${JSON.stringify(data)}`);
      data.tel = tel;
      data.openId = openId;
      requestTool.postwithhandle('login', data, (_data) => {
        if (_data) {
          if (status == 0 ){
            res.redirect(`${global.config.root}/login/success?name=${_data.name}`);
          } else if(status == 1) {
            res.send('讲座报名');
          } else if(status == 2) {
            res.send('家庭账号绑定');
          } else if(status == 3) {
            res.send('讲座报名信息');
          }
          
          // res.render('basic/login-success', {
          //   status: '登录',
          //   username: _data.name
          // });
        }
      }, (err) => {
        console.log(`[${new Date()}]User ${tel} login failed!`);
        res.redirect(`${global.config.root}/login/enter?tel=${tel}&errorMessage=${err}`);
        // res.render('basic/login-enter', {
        //   postUrl: `/login/verify?tel=${tel}`,
        //   errorMessage: err,
        //   tel: tel
        // });
      })
    });
  },

  // 注册
  register: (req, res) => {
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    let tel = req.query.tel;
    let status = req.query.status; // status状态数据
    console.log(`[${new Date()}] Register User: { tel: ${tel}, openId: ${openId}, status: ${status} }`);
    let postData = '';

    req.addListener('data', (data) => {
      postData += data;
    });

    req.addListener('end', () => {
      let data = querystring.parse(postData);
      console.log(`[${new Date()}] Register VerifyCode: ${JSON.stringify(data)}`);
      data.tel = tel;
      data.openId = openId;
      requestTool.postwithhandle('register', data, (_data) => {
        if (_data) {
          // res.redirect(`${global.config.root}/login/success?name=${_data.name}`);
          // res.render('basic/login-success', {
          //   status: '注册',
          //   username: _data.name
          // });
          if (status == 0 ){
            res.redirect(`${global.config.root}/login/success?name=${_data.name}`);
          } else if(status == 1) {
            res.send('讲座报名');
          } else if(status == 2) {
            res.send('家庭账号绑定');
          } else if(status == 3) {
            res.send('讲座报名信息');
          }
        }

      }, (err) => {
        console.log(`[${new Date()}] User ${tel} register failed!`);
        console.log(`[${new Date()}] Error Message: ${err}`);
        res.redirect(`${global.config.root}/register?tel=${tel}&errorMessage=${err}`);
        // res.render('basic/login-register', {
        //   postUrl: `/register?tel=${tel}`,
        //   errorMessage: err,
        //   tel: tel
        // });
      });
    });
  },

  // 获取登录验证码接口
  getLoginVerifyCode: (req, res) => {
    let tel = req.query.tel;
    requestTool.getApi(res, 'getLoginCode', `tel=${tel}`, (data) => {
      res.send(data);
    });
  },

  // 获取注册验证码接口
  getRegisterVerifyCode: (req, res) => {
    let tel = req.query.tel;
    requestTool.getApi(res, 'getRegisterCode', `tel=${tel}`, (data) => {
      res.send(data);
    });
  },

}
