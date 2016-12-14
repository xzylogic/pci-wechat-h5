'use strict';

var requestTool = require('../common/request-tool');

module.exports = {

  getApply: (req, res) => {
    res.render('lecture/apply', {
        name: 'Cajfkd'
      });
    console.log(res);
  },

  getSuccess: (req, res) => {
    res.render('lecture/apply-success');
  },


}
