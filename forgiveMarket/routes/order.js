var express = require('express');
var router = express.Router();
var user = require("../models/user");
var order = require("../models/order");
var multiparty = require("multiparty");

//注册models监听并传递models
function callback(models) {
	user.initModel(models);
}

//购物车界面
router.get('/cart', function(req, res, next) {
	console.log("cart router get");
  	res.render("order/shoppingcart");
});

//购物车获得商品内容
router.get('/cart/getgoods/:uid', function(req, res, next) {
	var uid = req.params.uid;
	var goods = [];
	console.log("cart getgoods router get"+uid);
	
	//查询是否已经创建购物车订单
	order.getOrder(uid, 0,function(geterr, getdata){
		if (!geterr) {
			if (getdata.length == 0) {
				//未创建
				console.log(new Date() + "SUCCESS: 购物车订单未创建");
				order.addOrder(uid, 0,function(adderr, adddata){
					if (!adderr) {
						console.log(new Date() + "SUCCESS: 购物车订单创建成功");
					} else{
						console.log(new Date() + "ERROR: 购物车订单创建失败");
						console.log(new Date() + "ERROR CONTENT: " + adderr);						
					}
				});
				
			} else{
				//已创建
				var oid = getdata[0]._id;
				console.log(new Date() + "SUCCESS: 购物车订单已创建");
				console.log(oid);
				goods = [{_id:"1"},{_id:"2"},{_id:"3"},{_id:"4"},{_id:"5"},{_id:"6"}];
			}
		} else{
			console.log(new Date() + "ERROR: " + geterr);
		}
		
  		res.send(goods);
	});
	
});

module.exports = router;
module.exports.callback = callback;