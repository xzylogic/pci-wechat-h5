'use strict';
var querystring = require('querystring');
// var sign = require('./sign.js');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

    getIsMyDoc: (req, res) => {
        //auth.setCookies(res, 'pci_secret', 'ox0ThwtVjZiQMWLCx3SwupAqG4zk');
        let url = requestTool.setAuthInfoUrl('/my-doctor', ''); // 重定向url
        let openId = req.query.openId;
        let userId = req.signedCookies.userId || 68;// 从cookie中找userId
        let data
        auth.getOpenId(req, res, url, (openId) => {
            if (userId) {
                requestTool.getwithhandle2('myDoctor', `userId=${userId}`, (myDoctor) => {
                if (myDoctor) {
                    console.log(myDoctor);
                    res.render('doctor/my-doctor', {
                        data: myDoctor.content
                    });
                } else {
                    res.render('doctor/no-check', {
                        url: `${global.config.root}/doctor/no-check`
                    });
                }
            }, (err) => {
                    res.render('error', {
                        message: err
                    })
                })
            } else {
                res.render('doctor/no-check', {
                    url: `${global.config.root}/doctor/no-check`
                });
            }
        });
    },

    goConsult: (req, res) => {
    // auth.setCookies(res, 'pci_secret', 'ovMkVwH6ldi-JOG4tdiVqcLJmR5s');
    let url = requestTool.setAuthUrl('/my-doctor/consult-doctor');
    let openId = req.query.openId;
    auth.getOpenId(req, res, url, (openId) => {
        res.render('doctor/consult-doctor', {
        url: `${global.config.root}/my-doctor/consult-doctor`
    });
    }, (err) => {
        res.render('error', {
            message: err
        });
    });
    }
}