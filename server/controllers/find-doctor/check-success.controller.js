'use strict';
var querystring = require('querystring');
// var sign = require('./sign.js');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

    checkSuccess: (req, res) => {
    // auth.setCookies(res, 'pci_secret', 'ovMkVwH6ldi-JOG4tdiVqcLJmR5s');
    let doctorName = req.query.doctorName || '';
    let admissionTime = req.query.admissionTime || '';
    let url = requestTool.setAuthInfoUrl('/find-doctor/check-success', '');
    let openId = req.query.openId;
    console.log(doctorName);
    auth.getOpenId(req, res, url, (openId) => {
        if (openId) {
            res.render('doctor/check-success',{
                doctorName: doctorName,
                admissionTime: admissionTime
            });
        }
    });
}}