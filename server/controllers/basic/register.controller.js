'use strict';

var requestTool = require('../common/request-tool');

module.exports = {

  getRegister: (req, res) => {
    res.render('basic/login-register');
  },

}
