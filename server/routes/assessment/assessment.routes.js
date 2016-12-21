'use strict';

var express = require('express');
var router = express.Router();
var RiskController = require('../../controllers/assessment/risk.controller');
var ResultController = require('../../controllers/assessment/result.controller');

router.route('/risk').post(RiskController.getRisk);
router.route('/result').get(ResultController.getResult);

module.exports = router;

