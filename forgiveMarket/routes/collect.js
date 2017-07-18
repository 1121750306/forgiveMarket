var express = require('express');
var router = express.Router();
var collect = require("../models/collect");

//注册models监听并传递models
function callback(models) {
	collect.initModel(models);
}

router.get('/addcollect', function(req, res, next) {
//	if (req.session.user == null) {
//		res.send({
//			flag: 300,
//			msg: "未登录"
//		});
//		return;
//	}
//	var uid = req.session.user[0]._id;
		var uid = "596c1006b78c401434acd7f0";
		var gid = '596da1006c2c5d11249e9716';
//	var gid = req.body.gid;
	var date = new Date();
	collect.addCollect(uid, gid, date, function(flag, err, result) {
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

router.post('/querycollect', function(req, res, next) {
	console.log("----")
//	if (req.session.user == null) {
//		res.send({
//			flag: 300,
//			msg: "未登录"
//		});
//		return;
//	}
//	var uid = req.session.user[0]._id;
	var uid = "596c1006b78c401434acd7f0";
	//	var index = req.body.index;
	var index = 0;
	collect.queryCollect(uid, index, function(flag, err, result) {
		console.log("result:" + result);
//		var resultjson = null;
//		if (result != null) {
//			resultjson = [];
//			for (var i = 0; i < result.length; i++) {
//				var date = new Date(Number(result[i].date));
//				console.log("date:" + date);
//				var dateStr = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
//				let isInsert = false;
//				for (var j = 0; j < resultjson.length; j++) {
//					if (resultjson[j].date == dateStr) {
//						resultjson[j].goods[resultjson[j].goods.length] = {
//							goodname: result[i].gid.gname,
//							goodprice: result[i].gid.pricebase,
//							gid:result[i].gid._id,
//							type:result[i].gid.typeid.tname
//						};
//						isInsert = true;
//					}
//				}
//				if (!isInsert) {
//					resultjson[resultjson.length] = {
//						date: dateStr,
//						goods: [{
//							goodname: result[i].gid.gname,
//							goodprice: result[i].gid.pricebase,
//							gid:result[i].gid._id,
//							type:result[i].gid.typeid.tname
//						}]
//					};
//				}
//				console.log("dateStr:" + dateStr);
//				result[i].date = dateStr;
//			}
//		}
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

router.get('/querygood', function(req, res, next) {
	console.log("----")
	var uid = "596c1006b78c401434acd7f0";
	//	var index = req.body.index;
	var index = 0;
	collect.queryGoodWithCollect(uid, function(flag, err, result) {
		console.log("result:" + result);
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