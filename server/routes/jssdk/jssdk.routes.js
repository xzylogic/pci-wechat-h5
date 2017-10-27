'use strict';

var express = require('express');
var router = express.Router();
var JssdkController = require('../../controllers/jssdk/jssdk.controller');

router.route('/signature').get(JssdkController.getSignature); // 获取config配置参数
router.route('/uploadImg').get(JssdkController.uploadImg); // 获取config配置参数

module.exports = router;