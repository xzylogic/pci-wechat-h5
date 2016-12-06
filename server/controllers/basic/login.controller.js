'use strict';

var requestTool = require('../common/request-tool');

module.exports = {

  getLogin: (req, res) => {
    res.render('basic/login');
  },

  getEnter: (req, res) => {
    res.render('basic/login-enter');
  },

  getSuccess: (req, res) => {
    res.render('basic/login-success', {
      status: '登录',
      username: '李四'
    });
  }

}
