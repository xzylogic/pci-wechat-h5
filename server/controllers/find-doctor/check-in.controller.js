'use strict';
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

    checkIn: (req, res) => {
    let doctorId = req.query.doctorId || '';
    let doctorPic = req.query.doctorPic || '';
    let doctorName = req.query.doctorName || '';
    let department = req.query.department || '';
    let doctorTitle = req.query.doctorTitle || '';
    let hospitalName = req.query.hospitalName || '';
    let url = requestTool.setAuthInfoUrl('/find-doctor/check-in', '');
    let urlQiniu = `${global.config.server}api/qiniu/auth`;
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) =>{
        res.render('doctor/check-in',{
            doctorId: doctorId,
            doctorPic: doctorPic,
            doctorName: doctorName,
            department: department,
            doctorTitle: doctorTitle,
            hospitalName: hospitalName,
            url: global.config.userServer,
            urlQiniu: urlQiniu,
            userId: data.userId,
            accessToken: data.access_token
        });
      },() =>{
        res.redirect(`${global.config.root}/login?status=4`);
      })
    });
}}