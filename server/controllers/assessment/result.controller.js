'use strict';

var requestTool = require('../common/request-tool');

module.exports = {

  getResult: (req, res) => {
    // requestTool.get(res, 'test', req.query, (data) => {
    //   console.log(data);
      res.render('assessment/result');
    // })
  },

}