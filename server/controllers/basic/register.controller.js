'use strict';

var requestTool = require('../common/request-tool');

module.exports = {

  getRegister: (req, res) => {
    // requestTool.get(res, 'test', req.query, (data) => {
    //   console.log(data);
      res.render('basic/register');
    // })
  },

}
