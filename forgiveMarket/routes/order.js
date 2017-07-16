var express = require('express');
var router = express.Router();
var user = require("../models/user");
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
	
	console.log("cart getgoods router get"+uid);
	var goods = [{_id:"1"},{_id:"2"},{_id:"3"},{_id:"4"},{_id:"5"},{_id:"6"}];
//	var goods = [];
	
  	res.send(goods);
});

module.exports = router;
module.exports.callback = callback;