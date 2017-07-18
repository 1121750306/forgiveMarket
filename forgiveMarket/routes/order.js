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

//结算界面
router.post('/', function(req, res, next) {
	//获取表单数据
	var oids = req.body.oids;
	
	console.log(oids);
	
  	res.render("/views/orderpay");
});


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
//				good.addGoods([{typeid:mongoose.Types.ObjectId("596d62d3c88ed10d0056f4e5"),gname:"商品1",pricebase:"100.1",discount:"0.1"},
//								{typeid:mongoose.Types.ObjectId("596d62d3c88ed10d0056f4e5"),gname:"商品2",pricebase:"200.1",discount:"0.2"},
//								{typeid:mongoose.Types.ObjectId("596d62d3c88ed10d0056f4e5"),gname:"商品3",pricebase:"300.1",discount:"0.3"},
//								{typeid:mongoose.Types.ObjectId("596d62d3c88ed10d0056f4e5"),gname:"商品4",pricebase:"400.1",discount:"0.4"},
//								{typeid:mongoose.Types.ObjectId("596d62d3c88ed10d0056f4e5"),gname:"商品5",pricebase:"500.1",discount:"0.5"},
//								{typeid:mongoose.Types.ObjectId("596d62d3c88ed10d0056f4e5"),gname:"商品6",pricebase:"600.1",discount:"0.6"},
//								{typeid:mongoose.Types.ObjectId("596d62d3c88ed10d0056f4e5"),gname:"商品7",pricebase:"700.1",discount:"0.7"},
//								{typeid:mongoose.Types.ObjectId("596d62d3c88ed10d0056f4e5"),gname:"商品8",pricebase:"800.1",discount:"0.8"}],
//								function(err){
//									if(!err){
//										console.log("商品批量添加成功");
//									}else{
//										console.log("商品批量添加失败");
//									}
//								});
//				goodsize.addGoodSizes([{gsname:"薄荷味1",priceoffset:-10,gid:"596d65898f9ff612b41729c2",sales:0,lefts:0,type:0},
//										{gsname:"150ml",priceoffset:-20,gid:"596d65898f9ff612b41729c2",sales:0,lefts:0,type:1},
//										{gsname:"薄荷味2",priceoffset:-20,gid:"596d65898f9ff612b41729c3",sales:0,lefts:0,type:0},
//										{gsname:"薄荷味3",priceoffset:-30,gid:"596d65898f9ff612b41729c4",sales:0,lefts:0,type:0},
//										{gsname:"薄荷味4",priceoffset:-40,gid:"596d65898f9ff612b41729c5",sales:0,lefts:0,type:0},
//										{gsname:"薄荷味5",priceoffset:-50,gid:"596d65898f9ff612b41729c6",sales:0,lefts:0,type:0},
//										{gsname:"薄荷味6",priceoffset:-60,gid:"596d65898f9ff612b41729c7",sales:0,lefts:0,type:0},
//										{gsname:"薄荷味7",priceoffset:-70,gid:"596d65898f9ff612b41729c8",sales:0,lefts:0,type:0},
//										{gsname:"薄荷味8",priceoffset:-80,gid:"596d65898f9ff612b41729c9",sales:0,lefts:0,type:0}],
//										function(err){
//											if(!err){
//												console.log("商品规格批量添加成功");
//											}else{
//												console.log("商品规格批量添加失败");
//											}
//										});
//
//				orderitem.addOrderItem({oid:"596c7fb3806c5204cc6a0b03",gid:mongoose.Types.ObjectId("596c7fb7806c5204cc6a0b04"),gsid:mongoose.Types.ObjectId("596c8155693f4621c0da48e0"),num:"1"})
//				orderitem.addOrderItems([{oid:mongoose.Types.ObjectId("596d6354f5dbd1151cfc9e43"),gid:mongoose.Types.ObjectId("596d65898f9ff612b41729c2"),gsids:[{gsid:mongoose.Types.ObjectId("596d663bab75051214cc9887")},{gsid:mongoose.Types.ObjectId("596d663bab75051214cc9888")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596d6354f5dbd1151cfc9e43"),gid:mongoose.Types.ObjectId("596d65898f9ff612b41729c3"),gsids:[{gsid:mongoose.Types.ObjectId("596d663bab75051214cc9889")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596d6354f5dbd1151cfc9e43"),gid:mongoose.Types.ObjectId("596d65898f9ff612b41729c4"),gsids:[{gsid:mongoose.Types.ObjectId("596d663bab75051214cc988a")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596d6354f5dbd1151cfc9e43"),gid:mongoose.Types.ObjectId("596d65898f9ff612b41729c5"),gsids:[{gsid:mongoose.Types.ObjectId("596d663bab75051214cc988b")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596d6354f5dbd1151cfc9e43"),gid:mongoose.Types.ObjectId("596d65898f9ff612b41729c6"),gsids:[{gsid:mongoose.Types.ObjectId("596d663bab75051214cc988c")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596d6354f5dbd1151cfc9e43"),gid:mongoose.Types.ObjectId("596d65898f9ff612b41729c7"),gsids:[{gsid:mongoose.Types.ObjectId("596d663bab75051214cc988d")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596d6354f5dbd1151cfc9e43"),gid:mongoose.Types.ObjectId("596d65898f9ff612b41729c8"),gsids:[{gsid:mongoose.Types.ObjectId("596d663bab75051214cc988e")}],num:"1"},
//										{oid:mongoose.Types.ObjectId("596d6354f5dbd1151cfc9e43"),gid:mongoose.Types.ObjectId("596d65898f9ff612b41729c9"),gsids:[{gsid:mongoose.Types.ObjectId("596d663bab75051214cc988f")}],num:"1"}],
//										function(err){
//											if(!err){
//												console.log("购物车订单批量添加成功");
//											}else{
//												console.log("购物车订单批量添加失败");
//											}
//										});
				
				
				var goods = [];
				
				//获取所有订单项
				orderitem.getOrderItem(data_getorder[0]._id, function(err_getorderitem, data_getorderitem){
					if (!err_getorderitem) {
						//遍历每个订单项
						for (var i = 0; i < data_getorderitem.length; i++) {
							var orderitem = data_getorderitem[i];
							
							//取得订单项的商品价格基数
							var price = orderitem.gid.pricebase;
							
							//取得订单项的商品规格数组
							var sizes = [];
							for (var j = 0; j < orderitem.gsids.length; j++) {
								var sizeitem = orderitem.gsids[j].gsid;
								
								//计算商品在此规格下价格偏移后的结果
								price = price + sizeitem.priceoffset;
								
								//将商品规格名加入数组
								sizes.push(sizeitem.gsname);
							}
							
							//计算订单项商品折扣
							price = (price*orderitem.gid.discount).toFixed(2);
							
							//拼接每个订单项中所需数据
							var good = {otid: orderitem._id,
										gid: orderitem.gid._id,
										gname: orderitem.gid.gname,
										gsizes: sizes,
										price: price,
										num: orderitem.num};
										
							//加入商品列表
							goods.push(good);
							
						}
						
						res.send(goods);
						
					} else{
						console.log(new Date() + "ERROR: " + err_getorderitem);
					}
					
				});
				
			}
		} else{
			console.log(new Date() + "ERROR: " + err_getorder);
		}
	});
	
});

//购物车删除商品订单项
router.get('/cart/deletegood/:otid', function(req, res, next) {
	var otid = req.params.otid;
	
	orderitem.deleteOrderItemById(otid, function(err, data){
		if (!err) {
			if (data.length != 0) {
				data.remove();
			} else{
				console.log(new Date() + "ERROR: 订单项id有误");
			}
		}else {
			console.log(new Date() + "ERROR: " + err);
		}
	})
	
  	res.send("success");
});

module.exports = router;
module.exports.callback = callback;