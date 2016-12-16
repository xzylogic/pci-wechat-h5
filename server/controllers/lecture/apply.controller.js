'use strict';
var querystring = require('querystring');
var requestTool = require('../common/request-tool');

module.exports = {

  getApply: (req, res) => {
   requestTool.getwithhandle('lecture',"", (_data) => {
        if (_data) {
          res.render('lecture/apply', {
              "json":_data,
              name:_data[0].name,
              errorMessage: ''
            });
        }
      }, (err) => {
        res.render('lecture/apply', {
          errorMessage: err,
        });
      });

  },

  Success: (req, res) => {

    var postData = '';

    req.addListener('data', (data) => {
      postData += data;
    });
    req.addListener('end', () => {
      let codeData = querystring.parse(postData);
      res.render('lecture/apply-success');

      // requestTool.post(res, 'apply', codeData, (_data) => {
      //   if (JSON.parse(_data).code == 0) {
          
      //   } else {
      //     res.render('lecture/apply');
      //   }
      // })
    });
  },


}
