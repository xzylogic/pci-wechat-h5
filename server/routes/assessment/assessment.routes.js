'use strict';

var express = require('express');
var router = express.Router();
var RiskController = require('../../controllers/assessment/risk.controller');
var ResultController = require('../../controllers/assessment/result.controller');

router.route('/risk').get(RiskController.getRisk);//检测页面
router.route('/risk/verify').post(RiskController.riskVerify);//检测请求
router.route('/result').get(ResultController.getResult);

module.exports = router;

