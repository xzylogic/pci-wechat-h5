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
  requestTool.getwithhandle(res, 'getToken', `code=${code}`, call)
}

module.exports = auth;
