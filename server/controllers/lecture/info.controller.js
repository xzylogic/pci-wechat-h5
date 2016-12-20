'use strict';

var requestTool = require('../common/request-tool');
var moment = require("moment");	

module.exports = {

  getInfo: (req, res) => {
     requestTool.getwithhandle('applyList',`openId=ox0ThwtVjZiQMWLCx3SwupAqG4zk`, (_data) => {
        if (_data) {
	    	for (var i = 0; i < _data.content.length; i++) {
	    		_data.content[i].time = moment(_data.content[i].time).format('YYYY-MM-DD h:mm');
	    		_data.content[i].day = new Date(_data.content[i].time).getDay();
	    		if(_data.content[i].day == 0){
	    			_data.content[i].day = "日";
	    		}else if(_data.content[i].day == 1){
	    			_data.content[i].day = "一";
	    		}else if(_data.content[i].day == 2){
	    			_data.content[i].day = "二";
	    		}else if(_data.content[i].day == 3){
	    			_data.content[i].day = "三";
	    		}else if(_data.content[i].day == 4){
	    			_data.content[i].day = "四";
	    		}else if(_data.content[i].day == 5){
	    			_data.content[i].day = "五";
	    		}else if(_data.content[i].day == 6){
	    			_data.content[i].day = "六";
	    		};
	    		if(_data.content[i].status == 0){
	    			_data.content[i].status = "报名成功";
	    		}else if(_data.content[i].status == 1){
	    			_data.content[i].status = "报名取消";
	    		}else if(_data.content[i].status == 2){
	    			_data.content[i].status = "报名签到";
	    		}else if(_data.content[i].status == 3){
	    			_data.content[i].status = "报名过期";
	    		}
	    		if(_data.content[i].charge == 0){
	    			_data.content[i].charge = "免费";
	    		}
	    	}
            res.render('lecture/info', {
              data:_data.content,
            });
        }
      }, (err) => {
        // res.render('lecture/info', {
        //   //errorMessage: err,
        // });
      });
  },



}
