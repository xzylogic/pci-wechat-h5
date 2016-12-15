'use strict';

var express = require('express');
var router = express.Router();
var LoginController = require('../../controllers/basic/login.controller');
var AccountBindController = require('../../controllers/basic/account-bind.controller');

// 页面路由
router.route('/login').get(LoginController.getLogin); // 登录入口页面
router.route('/login/enter').get(LoginController.getLoginEnter); // 登录验证页面
router.route('/register').get(LoginController.getRegister); // 注册验证页面
router.route('/login/success').get(LoginController.getLoginSuccess); // 登录成功页面

router.route('/account-bind').get(AccountBindController.getAccountBind); // 家庭账号列表页面
router.route('/account-bind/add').get(AccountBindController.getAccountBindAdd); // 添加家庭账号页面

// POST请求
router.route('/login').post(LoginController.login); //登录入口判断是否注册过
router.route('/login/verify').post(LoginController.loginVerify); // 登录
router.route('/register').post(LoginController.register); // 注册

// 接口请求
router.route('/login/enter/getVerifyCode')
  .get(LoginController.getLoginVerifyCode); // 获取登录时验证码
router.route('/register/getVerifyCode')
  .get(LoginController.getRegisterVerifyCode); // 获取注册时验证码

module.exports = router;
