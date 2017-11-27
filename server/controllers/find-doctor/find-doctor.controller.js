'use strict';
var querystring = require('querystring');
// var sign = require('./sign.js');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

    findDoctor: (req, res) => {
    // auth.setCookies(res, 'pci_secret', 'ovMkVwH6ldi-JOG4tdiVqcLJmR5s');
    let url = requestTool.setAuthUrl('/find-doctor');
    let openId = req.query.openId;
    auth.getOpenId(req, res, url, (openId) => {
        if (openId) {
            res.render('doctor/find-doctor', {
                url: `${global.config.server}`,
                url2: `${global.config.server2}`,
            });
        }
    //     requestTool.getwithhandle2('hospitalList', `openId=${openId}`, (hospitalList) => {
    //     console.log(hospitalList);
    //         if (hospitalList) {
    //
    //         }
    // }, (err) => {
    //     res.render('error', {
    //         message: err
    //     })
    // })
    });
    }
}