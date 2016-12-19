'use strict';
var querystring = require('querystring');
var requestTool = require('../common/request-tool');

module.exports = {

  getApply: (req, res) => {
   requestTool.getwithhandle('lecture',"", (_data) => {
        if (_data) {
          res.render('lecture/apply', {
              postUrl:`/lecture/apply/verify`,
              "json":_data,
              name:_data[0].name,
              id:_data[0].id,
              errorMessage: ''
            });
        }
      }, (err) => {
        res.render('lecture/apply', {
          errorMessage: err,
        });
      });

  },

//报名成功页面
  Success: (req, res) => {
    let img = req.query.img;
    res.render('lecture/apply-success',{
      imgUrl : img
    });
},

//报名请求
  applyVerify: (req, res) => {
    let postData = '';
     req.addListener('data', (data) => {
      postData += data;
    });
    req.addListener('end', () => {
      let data = querystring.parse(postData);
      data.openId = "ox0ThwtVjZiQMWLCx3SwupAqG4zk"; //王兵的opedId;
      requestTool.postwithhandle('apply', data, (_data) => {
        if (_data) {
          console.log(_data);
          res.redirect(`${global.config.root}/lecture/apply/success?img=${_data}`);
          // res.render('basic/login-success', {
          //   status: '登录',
          //   username: _data.name
          // });
        }else if(_data && code == 1000){
          //报名人数已满;
        }
      }, (err) => {
       res.redirect(`${global.config.root}/lecture/apply`);
        // res.render('basic/login-enter', {
        //   postUrl: `/login/verify?tel=${tel}`,
        //   errorMessage: err,
        //   tel: tel
        // });
      })
    });
  },











}