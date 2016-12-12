var superagent = require('superagent');

var BASE_URL = global.config.server;
var api = require('./api-url.json');

var requestTool = {};

/**
 * 使用superagent进行get请求
 * @param  {[type]} res   [response]
 * @param  {[type]} key   [api key]
 * @param  {[type]} param [query参数]
 * @param  {[type]} call  [callback函数]
 * @return {[type]}       []
 */
requestTool.get = function(res, key, param, call) {
  superagent
    .get(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        res.render('error', {
          "message": '请求错误'
        });
      } else {
        call(sres.text);
      }
    });
}

requestTool.getwithhandle = function(res, key, param, call) {
  superagent
    .get(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        res.render('error', {
          "message": '请求错误'
        });
      } else {
        if (sres.text.code === 0) {
          call(sres.text.data);
        } else {
          res.render('error', {
            "message": '请求错误'
          });
        }
      }
    });
}

/**
 * 使用superagent进行post请求
 * @param  {[type]} res  [response]
 * @param  {[type]} key  [api key]
 * @param  {[type]} data [post data]
 * @param  {[type]} call [callback函数]
 * @return {[type]}      []
 */
requestTool.post = function(res, key, data, call) {
  superagent.post(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .send(data)
    .end(function(err, sres) {
      if (err) {
        res.render('error', {
          "message": '请求错误'
        });
      } else {
        call(sres.text);
      }
    });
}

/**
 * 设置微信获取code的链接
 * @param {[type]} redirectUrl [微信重定向Url]
 * @param {[type]} state       [Url参数]
 */
requestTool.setAuthUrl = function(redirectUrl, state) {
  let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${global.config.appId}&redirect_uri=${global.config.domain}${global.config.root}${redirectUrl}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;
  return url;
}

module.exports = requestTool;
