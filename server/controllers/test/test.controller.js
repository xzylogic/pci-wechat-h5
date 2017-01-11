'use strict';

var requestTool = require('../common/request-tool');

module.exports = {

  getTest: (req, res) => {
    res.render('test/test');
  },

}
