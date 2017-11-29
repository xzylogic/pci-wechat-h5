'use strict';
var querystring = require('querystring');
// var sign = require('./sign.js');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

    checkIn: (req, res) => {
    // auth.setCookies(res, 'pci_secret', 'ovMkVwH6ldi-JOG4tdiVqcLJmR5s');
    let doctorId = req.query.doctorId || '';
    let doctorPic = req.query.doctorPic || '';
    let doctorName = req.query.doctorName || '';
    let department = req.query.department || '';
    let doctorTitle = req.query.doctorTitle || '';
    let hospitalName = req.query.hospitalName || '';
    let url = requestTool.setAuthInfoUrl('/find-doctor/check-in', '');
    let openId = req.query.openId;
    auth.getOpenId(req, res, url, (openId) => {
        if (openId) {
            res.render('doctor/check-in',{
                doctorId: doctorId,
                doctorPic: doctorPic,
                doctorName: doctorName,
                department: department,
                doctorTitle: doctorTitle,
                hospitalName: hospitalName,
                url: global.config.server2
            });
        }
    });
}}