var superagent = require('superagent');

var BASE_URL = global.config.server;
var api = require('./api-url.json');

var requestTool = {};

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

module.exports = requestTool;
