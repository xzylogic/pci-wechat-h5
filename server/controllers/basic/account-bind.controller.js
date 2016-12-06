'use strict';

var requestTool = require('../common/request-tool');

module.exports = {

  getAccountBind: (req, res) => {
    // requestTool.get(res, 'test', req.query, (data) => {
    //   console.log(data);
      res.render('basic/account-bind');
    // })
  },

  getAccountBindAdd: (req, res) => {
    // requestTool.get(res, 'test', req.query, (data) => {
    //   console.log(data);
      res.render('basic/account-bind-add');
    // })
  },

}
