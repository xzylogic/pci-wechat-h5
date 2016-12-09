'use strict';

var express = require('express');
var router = express.Router();
var LoginController = require('../../controllers/basic/login.controller');
var AccountBindController = require('../../controllers/basic/account-bind.controller');

router.route('/login/:type')
  .get(LoginController.getView);

router.route('/login/:type')
  .post(LoginController.loginVerify);

router.route('/verify/:type/:tel')
  .post(LoginController.login);

router.route('/register/:type/:tel')
  .post(LoginController.register);

router.route('/verify')
  .get(LoginController.verify);

router.route('/account-bind')
  .get(AccountBindController.getAccountBind);

router.route('/account-bind/add')
  .get(AccountBindController.getAccountBindAdd);

module.exports = router;
