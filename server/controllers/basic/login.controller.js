'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  // 登录入口页面
  // 登录4种status状态
  // 0 登录 1 上传病历 2 电子病历 3 随访计划  4 找医生  5实名认证 6随访反馈 7家庭账号 8向医生报到
  getLogin: (req, res) => {
    // 测试写死cookie数据
    // auth.setCookies(res, 'pci_secret', 'ovMkVwH6ldi-JOG4tdiVqcLJmR5s');
    // auth.setCookies(res, 'pci_secret', 'ox0ThwtVjZiQMWLCx3SwupAqG4zk');
    // res.clearCookie('pci_secret');
    let status = req.query.status || 0; // status状态数据
    let doctor = req.query.doctor || ''; // 找医生
    let Dotel = req.query.Dotel || ''; //向医生报到
    let url = requestTool.setAuthUrl('/login', status); // 重定向url
    let userId = req.signedCookies.userId || '';
    let accessToken = req.signedCookies.accessToken || '';
    let name = req.signedCookies.name || '';
    auth.getOpenId(req, res, url, (openId) => {
      // auth.isLogin(res, openId, (name) => {
      //   // 已登录跳转已登录页面
      //   res.redirect(`${global.config.root}/login/success?name=${name}`);
      // }, () => {
      //   // 未登录跳转登录页面
      //   res.render('basic/login', {
      //     status: status,
      //     errorMessage: ''
      //   });
      // });
      if (userId && accessToken) {
        res.redirect(`${global.config.root}/login/success?name=${name}`);
      } else {
        res.render('basic/login', {
          status: status,
          doctor: doctor,
          Dotel: Dotel,
          errorMessage: ''
        });
      }
    });
  },

  // 登录验证页面
  getLoginEnter: (req, res) => {
    let tel = req.query.tel || '';
    let errorMessage = req.query.errorMessage || '';
    let doctor = req.query.doctor || ''; // 找医生 
    let Dotel = req.query.Dotel || ''; //向医生报到
    let status = req.query.status || ''; // status状态数据
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId

    if (openId) {
      res.render('basic/login-enter', {
        postUrl: `/login/verify?tel=${tel}&status=${status}`,
        errorMessage: errorMessage,
        tel: tel,
        Dotel: Dotel,
        status: status,
        doctor:doctor
      });
    } else {
      res.redirect(`${global.config.root}/login?status=${status}`);
    }
  },

  // 注册验证页面
  getRegister: (req, res) => {
    let tel = req.query.tel || '';
    let errorMessage = req.query.errorMessage || '';
    let status = req.query.status || ''; // status状态数据
    let doctor = req.query.doctor || ''; // 找医生
    let Dotel = req.query.Dotel || ''; //向医生报到
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    if (openId) {
      res.render('basic/login-register', {
        postUrl: `/register?tel=${tel}&status=${status}`,
        status: status,
        errorMessage: errorMessage,
        tel: tel,
        Dotel: Dotel,
        doctor:doctor
      });
    } else {
      res.redirect(`${global.config.root}/login?status=${status}`);
    }
  },

  // 登录成功页面
  getLoginSuccess: (req, res) => {
    let name = req.query.name || '';
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    console.log(`[${new Date()}] Login UesrName: ${name}`);

    if (openId) {
      res.render('basic/login-success', {
        username: name
      });
    } else {
      res.redirect(`${global.config.root}/login?status=${status}`);
    }
  },

  // 判断用户是否已注册
  // 若注册过则跳转到登录页面
  // 若未注册就跳转到注册页面
  login: (req, res) => {

    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
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
        requestTool.getwithhandle('ifRegister', `tel=${postData}`, (result) => {
          res.send({
            result: {code: 0, data:result}
          })
        }, (err) => {
          res.send({
            err: err
          })
        });
      });
    }
  },

  // 获取验证码后登录操作
  loginVerify: (req, res) => {
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    let tel = req.query.tel || '';
    let status = req.query.status || ""; // status状态数据
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
        auth.setUserCookies(res, 'userId', _data.userId)
        auth.setUserCookies(res, 'accessToken', _data.accessToken)
        auth.setUserCookies(res, 'name', _data.name)
        auth.setUserCookies(res, 'phone', tel)
        res.send({
          data:{code:0,name: _data.name}
        })
      }, (err) => {
        res.send({
          err: err
        })
      })
    });
  },

  // 注册
  register: (req, res) => {
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    let tel = req.query.tel || '';
    let status = req.query.status || ''; // status状态数据
    console.log(`[${new Date()}] Register User: { tel: ${tel}, openId: ${openId}, status: ${status} }`);
    let postData = '';

    req.addListener('data', (data) => {
      postData += data;
    });

    req.addListener('end', () => {
      let data = querystring.parse(postData);
      data.password = (new Buffer(data.password)).toString('base64');
      data.tel = tel;
      data.openId = openId;
      console.log(`[${new Date()}] Register VerifyCode: ${JSON.stringify(data)}`);
      requestTool.postwithhandle('register', data, (_data) => {
        if (_data) {
          auth.setUserCookies(res, 'userId', _data.userId)
          auth.setUserCookies(res, 'accessToken', _data.accessToken)
          auth.setUserCookies(res, 'name', _data.name)
          auth.setUserCookies(res, 'phone', tel)
          res.send({
            data:{code:0,name: _data.name}
          })
        }
      }, (err) => {
        res.send({
          err: err
        })
      });
    });
  },

  // 获取登录验证码接口
  getLoginVerifyCode: (req, res) => {
    let tel = req.query.tel || '';
    requestTool.getApi(res, 'getLoginCode', `tel=${tel}`, (data) => {
      res.send(data);
    });
  },

  // 获取注册验证码接口
  getRegisterVerifyCode: (req, res) => {
    let tel = req.query.tel || '';
    requestTool.getApi(res, 'getRegisterCode', `tel=${tel}`, (data) => {
      res.send(data);
    });
  },

}
