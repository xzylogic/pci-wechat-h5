'use strict';

var express = require('express');
var router = express.Router();
var CheckSuccess = require('../../controllers/find-doctor/check-success.controller');

router.route('/find-doctor/check-success').get(CheckSuccess.checkSuccess);//向医生报到成功

module.exports = router;