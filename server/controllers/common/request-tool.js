'use strict';
var superagent = require('superagent');

var BASE_URL = global.config.server;
var api = require('./api-url.json');

var requestTool = {};

/**
 * 使用superagent进行get请求
 * @param  {} res   [response]
 * @param  {} key   [api key]
 * @param  {} param [query参数]
 * @param  {} call  [callback函数]
 * @return {}       []
 */
requestTool.get = function(res, key, param, call, error) {
  superagent
    .get(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(sres.text);
      }
    });
}

// 封装API get请求
requestTool.getApi = function(res, key, param, call) {
  superagent
    .get(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        res.send({ code: -1, msg: '接口请求错误' });
      } else {
        call(sres.text);
      }
    });
}

// 直接返回接口的data数据
requestTool.getwithhandle = function(res, key, param, call, error) {
  superagent
    .get(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        if (JSON.parse(sres.text).code === 0) {
          call(JSON.parse(sres.text).data);
        } else {
          res.render('error', {
            "message": '请求错误'
          });
        }
      }
    });
}

// 请求单独的url地址
requestTool.getwithurl = function(res, url, param, call, error) {
  superagent
    .get(url)
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(JSON.parse(sres.text));
      }
    });
}

/**
 * 使用superagent进行post请求
 * @param  {} res  [response]
 * @param  {} key  [api key]
 * @param  {} data [post data]
 * @param  {} call [callback函数]
 * @return {}      []
 */
requestTool.post = function(res, key, data, call, error) {
  superagent.post(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .send(data)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(sres.text);
      }
    });
}

/**
 * 设置微信获取code的链接
 * @param {} redirectUrl [微信重定向Url]
 * @param {} state       [Url参数]
 */
requestTool.setAuthUrl = function(redirectUrl, state) {
  let uri = encodeURIComponent(`${global.config.domain}${global.config.root}${redirectUrl}`);
  let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${global.config.appId}&redirect_uri=${uri}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;
  return url;
}

module.exports = requestTool;
