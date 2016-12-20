'use strict';

var express = require('express');
var router = express.Router();
var ApplyController = require('../../controllers/lecture/apply.controller');

var InfoController = require('../../controllers/lecture/info.controller');

var DetailController = require('../../controllers/lecture/detail.controller');

router.route('/apply').get(ApplyController.getIsapply); // 报名入口页面

router.route('/apply/enter').get(ApplyController.getApply);//报名页面

router.route('/apply/success').get(ApplyController.Success); //报名成功

router.route('/apply/verify').post(ApplyController.applyVerify);//报名请求


router.route('/info').get(InfoController.getInfo);

router.route('/detail').get(DetailController.getDetail);

module.exports = router;
