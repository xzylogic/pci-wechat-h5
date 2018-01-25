'use strict';
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  checkIn: (req, res) => {
    /**
     * 向医生报到页面
    */
    let doctorId = req.query.doctorId || '';
    let doctor = req.query.doctor || '';
    let doctorPic = req.query.doctorPic || '';
    let doctorName = req.query.doctorName || '';
    let department = req.query.department || '';
    let doctorTitle = req.query.doctorTitle || '';
    let hospitalName = req.query.hospitalName || '';
    let tel = req.query.tel || '';
    let url = requestTool.setAuthUrl(`/find-doctor/check-in?Dotel=${tel}`);
    let Dotel = req.query.Dotel || req.query.tel;
    let urlQiniu = `${global.config.server}api/qiniu/auth`;
    // 获取openId
    auth.getOpenId(req, res, url, (openId) => {
      // 判断是否登录
      auth.isLogin(req, (data) =>{
        // 判断是否实名认证
        requestTool.getHeader('certificationStatus', data.access_token, `userId=${data.userId}`, (_data) => {
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
                      accessToken: data.access_token,
                      status: _data.data.status || ''
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
                accessToken: data.access_token,
                status: _data.data.status || ''
            });
          }
        }, (err) =>{
          res.render('error', {
            message: err
          });
        });
      },() =>{
        res.redirect(`${global.config.root}/login?status=8&&Dotel=${Dotel}`);
      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    })
  }}
