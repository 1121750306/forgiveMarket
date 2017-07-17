var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var user = require("../models/user");
var good = require("../models/good");
var goodsize = require("../models/goodsize");
var order = require("../models/order");
var orderitem = require("../models/orderitem");
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
	order.getOrderByIdAndFlag(uid, 0,function(err_getorder, data_getorder){
		if (!err_getorder) {
			if (data_getorder.length == 0) {
				//未创建
				console.log(new Date() + "SUCCESS: 购物车订单未创建");
				order.addOrder(uid, 0,function(err_addorder){
					if (!err_addorder) {
						console.log(new Date() + "SUCCESS: 购物车订单创建成功");
					} else{
						console.log(new Date() + "ERROR: 购物车订单创建失败");
						console.log(new Date() + "ERROR CONTENT: " + err_addorder);						
					}
				});
				
			} else{
				//已创建
				//获得订单id
				var oid = data_getorder[0]._id;
				console.log(new Date() + "SUCCESS: 购物车订单已创建");
				
				//测试数据
//				good.addGood({typeid:"1",gname:"商品1",pricebase:"200.1",discount:"0.8"},function(err){
//					if(!err){
//						console.log("success");
//					}else{
//						console.log("fail");
//					}
//				});
//				goodsize.addGoodSizes([{gsname:"薄荷味",priceoffset:-10,gid:"596c7fb7806c5204cc6a0b04",sales:0,lefts:0,type:0},
//										{gsname:"150ml",priceoffset:-20,gid:"596c7fb7806c5204cc6a0b04",sales:0,lefts:0,type:1},
//										{gsname:"薄荷味",priceoffset:-20,gid:"222c7fb7806c5204cc6a0b04",sales:0,lefts:0,type:0},
//										{gsname:"薄荷味",priceoffset:-30,gid:"333c7fb7806c5204cc6a0b04",sales:0,lefts:0,type:0},
//										{gsname:"薄荷味",priceoffset:-40,gid:"444c7fb7806c5204cc6a0b04",sales:0,lefts:0,type:0},
//										{gsname:"薄荷味",priceoffset:-50,gid:"555c7fb7806c5204cc6a0b04",sales:0,lefts:0,type:0},
//										{gsname:"薄荷味",priceoffset:-60,gid:"666c7fb7806c5204cc6a0b04",sales:0,lefts:0,type:0},
//										{gsname:"薄荷味",priceoffset:-70,gid:"777c7fb7806c5204cc6a0b04",sales:0,lefts:0,type:0},
//										{gsname:"薄荷味",priceoffset:-80,gid:"888c7fb7806c5204cc6a0b04",sales:0,lefts:0,type:0}],
//										function(err){
//											
//										});
//				orderitem.addOrderItems([{oid:"596c3249e4347517345779c3",gid:"596c490ec55a7b115875635a",gsid:"596c5c949081f209c099c26a",num:"1"},
//										{oid:"596c3249e4347517345779c3",gid:"222c490ec55a7b115875635a",gsid:"596c5c949081f209c099c26c",num:"2"},
//										{oid:"596c3249e4347517345779c3",gid:"333c490ec55a7b115875635a",gsid:"596c5c949081f209c099c26d",num:"3"},
//										{oid:"596c3249e4347517345779c3",gid:"444c490ec55a7b115875635a",gsid:"596c5c949081f209c099c26e",num:"4"},
//										{oid:"596c3249e4347517345779c3",gid:"555c490ec55a7b115875635a",gsid:"596c5c949081f209c099c26f",num:"5"},
//										{oid:"596c3249e4347517345779c3",gid:"666c490ec55a7b115875635a",gsid:"596c5c949081f209c099c270",num:"6"},
//										{oid:"596c3249e4347517345779c3",gid:"777c490ec55a7b115875635a",gsid:"596c5c949081f209c099c271",num:"7"},
//										{oid:"596c3249e4347517345779c3",gid:"888c490ec55a7b115875635a",gsid:"596c5c949081f209c099c272",num:"8"}],
//										function(err){
//											if(!err){
//												console.log("success");
//											}else{
//												console.log("fail");
//											}
//										})
				
//				orderitem.addOrderItem({oid:"596c7fb3806c5204cc6a0b03",gid:mongoose.Types.ObjectId("596c7fb7806c5204cc6a0b04"),gsid:mongoose.Types.ObjectId("596c8155693f4621c0da48e0"),num:"1"})
//				orderitem.addOrderItems([{oid:mongoose.Types.ObjectId("596ca7ec8fea524744e7cdcc"),gid:mongoose.Types.ObjectId("596c7fb7806c5204cc6a0b04"),gsids:[{gsid:mongoose.Types.ObjectId("596c8155693f4621c0da48e0")},{gsid:mongoose.Types.ObjectId("596c8155693f4621c0da48e1")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596ca7ec8fea524744e7cdcc"),gid:mongoose.Types.ObjectId("222c7fb7806c5204cc6a0b04"),gsids:[{gsid:mongoose.Types.ObjectId("596c8155693f4621c0da48e2")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596ca7ec8fea524744e7cdcc"),gid:mongoose.Types.ObjectId("333c7fb7806c5204cc6a0b04"),gsids:[{gsid:mongoose.Types.ObjectId("596c8155693f4621c0da48e3")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596ca7ec8fea524744e7cdcc"),gid:mongoose.Types.ObjectId("444c7fb7806c5204cc6a0b04"),gsids:[{gsid:mongoose.Types.ObjectId("596c8155693f4621c0da48e4")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596ca7ec8fea524744e7cdcc"),gid:mongoose.Types.ObjectId("555c7fb7806c5204cc6a0b04"),gsids:[{gsid:mongoose.Types.ObjectId("596c8155693f4621c0da48e5")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596ca7ec8fea524744e7cdcc"),gid:mongoose.Types.ObjectId("666c7fb7806c5204cc6a0b04"),gsids:[{gsid:mongoose.Types.ObjectId("596c8155693f4621c0da48e6")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596ca7ec8fea524744e7cdcc"),gid:mongoose.Types.ObjectId("777c7fb7806c5204cc6a0b04"),gsids:[{gsid:mongoose.Types.ObjectId("596c8155693f4621c0da48e7")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596ca7ec8fea524744e7cdcc"),gid:mongoose.Types.ObjectId("888c7fb7806c5204cc6a0b04"),gsids:[{gsid:mongoose.Types.ObjectId("596c8155693f4621c0da48e8")}],num:"1"}],
//										function(err){
//											if(!err){
//												console.log("success");
//											}else{
//												console.log("fail");
//											}
//										});
				
				
				var goods = [];
				
				//获取所有订单项
				orderitem.getOrderItem1(data_getorder[0]._id, function(err_getorderitem, data_getorderitem){
					if (!err_getorderitem) {
//						console.log("result:" + data_getorderitem[0]);
						
						for (var i = 0; i < data_getorderitem.length; i++) {
							var orderitem = data_getorderitem[i];
							console.log(orderitem.gsids);
//							var good = {name:orderitem.gid.gname, size:};
							
						}
					} else{
						console.log(new Date() + "ERROR: " + err_getorderitem);
					}
				});
//				console.log(items);

				goods = [{_id:"1"},{_id:"2"},{_id:"3"},{_id:"4"},{_id:"5"},{_id:"6"}];
			}
		} else{
			console.log(new Date() + "ERROR: " + err_getorder);
		}
		
  		res.send(goods);
	});
	
});

module.exports = router;
module.exports.callback = callback;