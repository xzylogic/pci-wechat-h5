'use strict';

var express = require('express');
var router = express.Router();
var LoginController = require('../../controllers/basic/login.controller');
var AccountBindController = require('../../controllers/basic/account-bind.controller');

router.route('/login')
  .get(LoginController.getView)
  .post(LoginController.loginVerify);

router.route('/verify/:tel')
  .post(LoginController.login);

router.route('/register/:tel')
  .post(LoginController.register);

router.route('/verify')
  .get(LoginController.verify);

router.route('/account-bind')
  .get(AccountBindController.getAccountBind);

router.route('/account-bind/add')
  .get(AccountBindController.getAccountBindAdd);

module.exports = router;
