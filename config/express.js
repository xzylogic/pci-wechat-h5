'use strict';

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var routesTool = require('./routes-tool');

module.exports = function() {

  var app = express();
  var resources = {
    view: '/client/views',
    assets: '/client/assets'
  };

  // 设置模版引擎
  app.set('views', process.cwd() + resources.view);
  app.set('view engine', 'ejs');

  app.use(logger('dev'));

  app.use(bodyParser.json());

  //设置全局函数
  app.locals['_src'] = function(src) {
    return routesTool.routesConfig.root + src;
  };

  console.log(process.cwd() + resources.assets);
  // 静态资源访问路径设置
  app.use(routesTool.routesConfig.root, express.static(process.cwd() + resources.assets));

  // 路由配置
  routesTool.useRoutes(app);

  return app;

}
