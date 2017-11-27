'use strict';
var querystring = require('querystring');
// var sign = require('./sign.js');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

    checkIn: (req, res) => {
    // auth.setCookies(res, 'pci_secret', 'ovMkVwH6ldi-JOG4tdiVqcLJmR5s');
    let url = requestTool.setAuthInfoUrl('/find-doctor/check-in', '');
res.render('doctor/check-in');
// auth.getOpenId(req, res, url, (openId) => {
//     requestTool.getwithhandle('result', `openId=${openId}`, (result) => {
//         res.render('/doctor/find-doctor');
// }, (err) => {
//     res.render('error', {
//         message: err
//     })
// })});
}
}