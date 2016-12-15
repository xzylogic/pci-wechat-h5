'use strict';

var express = require('express');
var router = express.Router();
var LoginController = require('../../controllers/basic/login.controller');
var AccountBindController = require('../../controllers/basic/account-bind.controller');

router.route('/login')
  .get(LoginController.getView)
  .post(LoginController.login);

router.route('/login/verify').post(LoginController.loginVerify);

router.route('/login/getVerifyCode')
  .get(LoginController.getLoginVerifyCode);

router.route('/register')
  .post(LoginController.register);

router.route('/register/getVerifyCode')
  .get(LoginController.getRegisterVerifyCode);

router.route('/account-bind')
  .get(AccountBindController.getAccountBind);

router.route('/account-bind/add')
  .get(AccountBindController.getAccountBindAdd);

module.exports = router;
