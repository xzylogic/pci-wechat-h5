'use strict';

var requestTool = require('./request-tool');

var auth = {};

/**
 * 存储加密的cookie
 * @param  {[type]} res         [response]
 * @param  {[type]} openId      [openId]
 * @param  {[type]} accessToken [accessToken]
 * @return {[type]}             []
 */
auth.setCookies = (res, key, value) => {
  res.cookie(key, value, { maxAge: 86400000, httpOnly: true, signed: true });
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
  // 测试使用
auth.getTokenCopy = (res, code, call) => {
  requestTool.getwithurl('https://api.weixin.qq.com/sns/oauth2/access_token', `appid=wx5921baa9a4522266&secret=23ed70a87e976da7756b076166f88723&code=${code}&grant_type=authorization_code`, call, (err) => {
    res.render('error', {
      "message": '请求错误'
    });
  });
}

/**
 * 获取openId
 * @param  {[type]} req         [request]
 * @param  {[type]} res         [response]
 * @param  {[type]} redirectUrl [redirectUrl]
 * @param  {[type]} call        [callback函数]
 * @return {[type]}             []
 */
auth.getOpenId = (req, res, redirectUrl, call) => {
  console.log(`[${new Date()}] Cookies: ${JSON.stringify(req.signedCookies)}`);
  let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
  let code = req.query.code || ''; // 微信返回code
  if (openId) {
    call(openId);
  } else if (code) {
    console.log(`[${new Date()}] Request Code: ${code}`);
    auth.getToken(res, code, (data) => {
      console.log(`[${new Date()}] GET OpenId: ${data.openid}`);
      auth.setCookies(res, 'pci_secret', data.openid);
      call(data.openid);
    });
    // auth.getTokenCopy(res, code, (data) => {
    //   console.log(`[${new Date()}] GET OpenId: ${data.openid}`);
    //   auth.setCookies(res, 'pci_secret', data.openid);
    //   call(data.openid);
    // });
  } else {
    console.log(`[${new Date()}] Redirect Url: ${redirectUrl}`);
    res.redirect(redirectUrl);
  }
}

/**
 * 判断用户是否已登录
 * 0 登录 1 讲座报名 2 家庭账号绑定 3 讲座报名信息
 * @param  {[type]} res       [response]
 * @param  {[type]} openId    [openId]
 * @param  {[type]} call      [已登录操作]
 * @param  {[type]} calllogin [未登录返回登录操作]
 * @return {}                 []
 */
auth.isLogin = (res, openId, call, calllogin) => {
  requestTool.get('login', `openId=${openId}`, (data) => {
    var _data = JSON.parse(data);
    if (_data.code === 0 && _data.data && _data.data.name) {
      call(_data.data.name);
    } else {
      calllogin();
    }
  }, (err) => {
    res.render('error', {
      message: '请求错误'
    });
  });
}

module.exports = auth;
