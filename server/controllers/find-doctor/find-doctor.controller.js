'use strict';
var querystring = require('querystring');
// var sign = require('./sign.js');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

    findDoctor: (req, res) => {
    auth.setCookies(res, 'pci_secret', 'ovMkVwAqHDRVJ9cTDVAUDBmNjHYw');
    let url = requestTool.setAuthUrl('/find-doctor');
    let openId = req.query.openId;
    let userId = req.signedCookies.userId || ''; // 从cookie中找userId
    let accessToken = req.signedCookies.accessToken
    auth.getOpenId(req, res, url, (openId) => {
        if (openId) {
            res.render('doctor/find-doctor', {
                url: `${global.config.server}`,
                url2: `${global.config.userServer}`,
                userId: userId,
                accessToken: accessToken
            });
        }
    });
    }
}