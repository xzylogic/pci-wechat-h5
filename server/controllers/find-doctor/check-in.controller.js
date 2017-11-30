'use strict';
var querystring = require('querystring');
// var sign = require('./sign.js');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

    checkIn: (req, res) => {
    auth.setCookies(res, 'pci_secret', 'ovMkVwAqHDRVJ9cTDVAUDBmNjHYw');
    let doctorId = req.query.doctorId || '';
    let doctorPic = req.query.doctorPic || '';
    let doctorName = req.query.doctorName || '';
    let department = req.query.department || '';
    let doctorTitle = req.query.doctorTitle || '';
    let hospitalName = req.query.hospitalName || '';
    let userId = req.signedCookies.userId || ''; // 从cookie中找userId
    let accessToken = req.signedCookies.accessToken
    let url = requestTool.setAuthInfoUrl('/find-doctor/check-in', '');
    let openId = req.query.openId;
    let urlQiniu = 'http://10.2.10.10/pci-micro/api/qiniu/auth';
    auth.getOpenId(req, res, url, (openId) => {
        if (openId) {
            res.render('doctor/check-in',{
                doctorId: doctorId,
                doctorPic: doctorPic,
                doctorName: doctorName,
                department: department,
                doctorTitle: doctorTitle,
                hospitalName: hospitalName,
                url: global.config.userServer,
                urlQiniu: urlQiniu,
                userId: userId,
                accessToken: accessToken
            });
        }
    });
}}