'use strict';

var express = require('express');
var router = express.Router();
var ApplyController = require('../../controllers/lecture/apply.controller');

var InfoController = require('../../controllers/lecture/info.controller');

var DetailController = require('../../controllers/lecture/detail.controller');

router.route('/apply').get(ApplyController.getApply);

router.route('/apply/success').get(ApplyController.Success);

router.route('/apply/verify').post(ApplyController.applyVerify);

router.route('/info').get(InfoController.getInfo);

router.route('/detail').get(DetailController.getDetail);

module.exports = router;
