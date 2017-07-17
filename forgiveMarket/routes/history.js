var express = require('express');
var router = express.Router();
var history = require("../models/history");

//注册models监听并传递models
function callback(models) {
	history.initModel(models);
}

router.get('/addhistory', function(req, res, next) {
	if (req.session.user == null) {
		res.send({
			flag: 300,
			msg: "未登录"
		});
		return;
	}
	var uid = req.session.user[0]._id;
	var gid = '555';
	var date = new Date();
	history.addHistory(uid, gid, date, function(flag, err, result) {
		if (flag == 1) {
			res.send({
				flag: 200,
				msg: "添加成功",
				result: result
			});
		} else {
			res.send({
				flag: 300,
				msg: "添加出错"
			});
		}
	})
});

router.get('/addhistory', function(req, res, next) {
	if (req.session.user == null) {
		res.send({
			flag: 300,
			msg: "未登录"
		});
		return;
	}
	var uid = req.session.user[0]._id;
	var gid = '555';
	var date = new Date();
	history.addHistory(uid, gid, date, function(flag, err, result) {
		if (flag == 1) {
			res.send({
				flag: 200,
				msg: "添加成功",
				result: result
			});
		} else {
			res.send({
				flag: 300,
				msg: "添加出错"
			});
		}
	})
});
module.exports = router;
module.exports.callback = callback;