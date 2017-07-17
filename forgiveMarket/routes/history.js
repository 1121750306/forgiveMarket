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
	});
});

router.get('/queryhistory', function(req, res, next) {
	if (req.session.user == null) {
		res.send({
			flag: 300,
			msg: "未登录"
		});
		return;
	}
//	var uid = req.session.user[0]._id;
	var uid = ObjectId("596c220ca8d95a15803dc5e5");
	history.queryHistory(uid, 0, function(flag, err, result) {
		console.log("result:" +result);
		for (var i = 0; i < result.length; i++) {
			var date = new Date(result[i].date);
			console.log("date:" + date);
			var dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			console.log("dateStr:" + dateStr);
			result[i].date = dateStr;
		}
		if (flag == 1) {
			res.send({
				flag: 200,
				msg: "获取成功",
				result: result
			});
		} else {
			res.send({
				flag: 300,
				msg: "获取失败"
			});
		}
	})
});
module.exports = router;
module.exports.callback = callback;