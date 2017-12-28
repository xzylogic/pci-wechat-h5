'use strict';
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  checkIn: (req, res) => {
    let doctorId = req.query.doctorId || '';
    let doctor = req.query.doctor || '';
    let doctorPic = req.query.doctorPic || '';
    let doctorName = req.query.doctorName || '';
    let department = req.query.department || '';
    let doctorTitle = req.query.doctorTitle || '';
    let hospitalName = req.query.hospitalName || '';
    let Dotel = req.query.tel || '';
    let url = requestTool.setAuthUrl('/find-doctor/check-in', Dotel);
    let urlQiniu = `${global.config.server}api/qiniu/auth`;
    auth.getFatherOpenId(req, res, url, (state) => {
      auth.isLogin(req, (data) =>{
        if (Dotel) {
           requestTool.getHeader('doctorInfo', data.access_token, `phone=${Dotel}`, (_res) => {
              if (_res.code === 0 && _res.data) {
                res.render('doctor/check-in',{
                    doctorId: _res.data.doctorId || '',
                    doctor: doctor,
                    doctorPic: _res.data.avatarUrl || '',
                    doctorName: _res.data.name || '',
                    department: _res.data.department || '',
                    doctorTitle: _res.data.doctorTitle || '',
                    hospitalName: _res.data.hospital || '',
                    url: global.config.userServer,
                    urlQiniu: urlQiniu,
                    userId: data.userId,
                    accessToken: data.access_token
                });
              }
            }, (err) => {
              res.render('error', {
                message: '服务器请求错误，请返回页面重试~'
              });
            }) 
        } else {
          res.render('doctor/check-in',{
              doctorId: doctorId,
              doctor: doctor,
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
        }
      },() =>{
        res.redirect(`${global.config.root}/login?status=8&&Dotel=${state}`);
      })
    })
  }}