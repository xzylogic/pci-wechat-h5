'use strict';

var express = require('express');
var router = express.Router();
var LoginController = require('../../controllers/basic/login.controller');
var RegisterController = require('../../controllers/basic/register.controller');
var AccountBindController = require('../../controllers/basic/account-bind.controller');

router.route('/login').get(LoginController.getLogin);

router.route('/register').get(RegisterController.getRegister);

router.route('/account-bind').get(AccountBindController.getAccountBind);

module.exports = router;
