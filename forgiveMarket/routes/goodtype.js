var express = require('express');
var router = express.Router();
var goodtype = require("../models/goodtype")

//注册models监听并传递models
function callback(models) {
	goodtype.initModel(models);
}

//获得商品类型列表
router.get('/', function(req, res, next) {
	 //goodtype.addGoodTypes(["面部护理","身体护理","隔离防晒","妆前打底","修颜遮瑕","面部彩妆","清洁卸妆","男士系列","指甲油","美容工具","优惠套装","会员专区"]);
	console.log("goodtype router get");
	goodtype.getGoodTypes(function(err, data){
		if (!err) {
			console.log("SUCCESS: " + "all good types get");
			console.log(data);
			res.send(data);
		} else{
			console.log("ERROR: " + err);
			res.send("error");  	
		}
	});

});

module.exports = router;
module.exports.callback = callback;