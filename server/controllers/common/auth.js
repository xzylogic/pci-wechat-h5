'use strict';

var requestTool = require('./request-tool');

var auth = {};

/**
 * 将openId和accessToken存入cookie
 * @param  {[type]} res         [response]
 * @param  {[type]} openId      [openId]
 * @param  {[type]} accessToken [accessToken]
 * @return {[type]}             []
 */
auth.setCookies = (res, key, value) => {
  res.cookie(key, value, { maxAge: 900000, httpOnly: true, signed: true });
}

/**
 * 通过code获取openId
 * @param  {[type]} res  [response]
 * @param  {[type]} code [code]
 * @param  {[type]} call [callback函数]
 * @return {[type]}      []
 */
auth.getToken = (res, code, call) => {
  requestTool.getwithhandle('getToken', `code=${code}`, call, (err) => {
    res.render('error', {
      "message": '请求错误'
    });
  });
}

// auth.getTokenCopy = (res, code, call) => {
//   requestTool.getwithurl('https://api.weixin.qq.com/sns/oauth2/access_token', `appid=wx5921baa9a4522266&secret=23ed70a87e976da7756b076166f88723&code=${code}&grant_type=authorization_code`, call, (err) => {
//     res.render('error', {
//       "message": '请求错误'
//     });
//   });
// }

/**
 * 判断用户是否已登录
 * @param  {[type]} res    [description]
 * @param  {[type]} openid [description]
 * @param  {[type]} call   [description]
 * @return {[type]}        [description]
 */
auth.isLogin = (res, openid, call) => {
  requestTool.getwithhandle(res, 'isLogin', '', (data) => {
    if (data === 1) {
      res.render('basic/login');
    } else {
      call(res);
    }
  });
}

module.exports = auth;
