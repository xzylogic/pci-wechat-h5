'use strict';
var querystring = require('querystring');
var requestTool = require('../common/request-tool');

module.exports = {

  getApply: (req, res) => {
    res.render('lecture/apply', {

      });

  },

  Success: (req, res) => {

    var postData = '';

    req.addListener('data', (data) => {
      postData += data;
    });

    req.addListener('end', () => {
      let codeData = querystring.parse(postData);
      console.log(`POST login ${JSON.stringify(codeData)}`);

      requestTool.post(res, 'lecture', codeData, (_data) => {
        if (JSON.parse(_data).code == 0) {
          res.render('lecture/apply-success');
        } else {
          res.render('lecture/apply');
        }
      })
    });
  },


}
