'use strict';
var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  getIsapply: (req,res) =>{
    //auth.setCookies(res, 'pci_secret', 'ox0ThwtVjZiQMWLCx3SwupAqG4zk');
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
    let err = req.query.err;
    let errorMessage = '';
    if(err){
      errorMessage = err;
    };
   requestTool.getwithhandle('lecture',"", (_data) => {
        if (_data && _data.length !== 0) {
          res.render('lecture/apply', {
              postUrl:`/lecture/apply/verify`,
              "json":_data,
              name:_data[0].name,
              id:_data[0].id,
              errorMessage: errorMessage
            });
        } else if(_data && _data.length == 0){
          res.render('lecture/apply',{
            postUrl:`/lecture/apply/verify`,
            "json":_data,
            name:"",
            id:"",
            errorMessage:'没有可报名的讲座'
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
      let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
      data.openId = openId;
      requestTool.postwithhandle('apply', data, (_data) => {
        if (_data) {

          res.redirect(`${global.config.root}/lecture/apply/success?img=${_data}`);

        }
      }, (err) => {
        res.redirect(`${global.config.root}/lecture/apply/enter?err=${err}`);
      })
    });
  },











}