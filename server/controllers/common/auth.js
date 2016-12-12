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
  requestTool.getwithhandlecopy(res, 'https://api.weixin.qq.com/sns/oauth2/access_token', `appid=wx47391e9ef8958539&secret=fd128e6b0af853ec6d137eb6fc1efe29&code=${code}&grant_type=authorization_code`, call)
  // requestTool.getwithhandlecopy(res, 'https://api.weixin.qq.com/sns/oauth2/access_token', `appid=wx5921baa9a4522266&secret=23ed70a87e976da7756b076166f88723&code=${code}&grant_type=authorization_code`, call)
  // requestTool.get(res, 'getToken', `code=${code}`, call)
}

// auth.isLogin(res, openid, call) => {
//   requestTool.get(res, 'isLogin', '', (data) => {
//     if(data.code === 0 && data.data ===1 ) {
      
//     }
//   });
// }

module.exports = auth;
