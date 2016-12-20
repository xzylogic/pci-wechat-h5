'use strict';
var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  getIsapply: (req,res) =>{
    // 测试写死cookie数据
    // auth.setCookies(res, 'pci_secret', 'ox0ThwmPe29gK2bl8v7cbr6Z-emg');
    // auth.setCookies(res, 'pci_secret', 'ox0ThwtVjZiQMWLCx3SwupAqG4zk');
    // res.clearCookie('pci_secret');
    let url = requestTool.setAuthUrl('/lecture/apply'); // 重定向url

    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(res, openId, (name) => {
        // 已登录跳转报名页面
        res.redirect(`${global.config.root}/lecture/apply/enter`);
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=1`);
      });
    });
  },



  getApply: (req, res) => {
   requestTool.getwithhandle('lecture',"", (_data) => {
        if (_data && _data.length !== 0) {
          res.render('lecture/apply', {
              postUrl:`/lecture/apply/verify`,
              "json":_data,
              name:_data[0].name,
              id:_data[0].id,
              errorMessage: ''
            });
        } else if(_data){
          res.render('lecture/apply',{
            postUrl:`/lecture/apply/verify`,
            "json":_data,
            name:"",
            id:"",
            errorMessage:''
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