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
	order.initModel(models);
}

//添加商品至用户购物车
router.post('/addtocart', function(req, res, next) {
	//获取表单数据
	var uid = req.body.uid;
	var gid = req.body.gid;
	var gsids = JSON.parse(req.body.gsids);
	var num = req.body.num;
	
	order.getOrderByIdAndFlag(uid, 0, function(err_getorder, data_getorder){
		if (!err_getorder) {
			if (data_getorder.length != 0) {
				//已创建购物车
				//获得购物车id
				var oid = data_getorder[0]._id;
				
				//封装商品规格信息
				var temp = [];
				for (var i = 0; i < gsids.length; i++) {
					temp.push({gsid:mongoose.Types.ObjectId(gsids[i])})
				}
				gsids = temp;
				
				//添加商品订单项
				orderitem.addOrderItem({
					oid:mongoose.Types.ObjectId(oid),
					gid:mongoose.Types.ObjectId(gid),
					gsids:gsids,
					num:num
				},function(err_addorder){
					if (!err_addorder) {
						//添加成功	
						res.send({type:"success", message: "商品订单项添加成功"});
					} else{
						console.log(new Date() + "ERROR: 商品订单项添加失败");
						console.log(new Date() + "ERROR CONTENT: " + err_addorder);	
						res.send({type:"error", message: "商品订单项添加失败"});
					}
				});
				
			} else{
				//未创建购物车
				res.send({type:"error", message:"购物车未创建"});
				
			}
		} else{
			console.log(new Date() + "ERROR: " + err_getorder);
			res.send({type:"error", message: "购物车搜索错误" });
		}
	});
	
});

//获得关于用户的订单项
router.get('/getorderitembyuser/:uid/:flag', function(req, res, next) {
	var uid = req.params.uid;
	var flag = req.params.flag;
	var goods = [];
	
	//查询是否已经创建订单
	order.getOrderByIdAndFlag(uid, flag, function(err_getorder, data_getorder){
		if (!err_getorder) {
			if (data_getorder.length == 0) {
				//未创建
				order.addOrder(uid, flag, function(err_addorder){
					if (!err_addorder) {
						res.send({type:"error", message: "订单不存在，现已创建成功" });
						
					} else{
						res.send({type:"error", message: "订单不存在，创建失败" });
						console.log(new Date() + "ERROR: 订单创建失败");
						console.log(new Date() + "ERROR CONTENT: " + err_addorder);	
						
					}
				});
				
			} else{
				//已创建
				//获得订单id
				var oid = data_getorder[0]._id;
				
				//测试数据
//				good.addGoods([{typeid:mongoose.Types.ObjectId("596e1772f99d950a343c352f"),gname:"商品1",pricebase:"100.1",discount:"0.1"},
//								{typeid:mongoose.Types.ObjectId("596e1772f99d950a343c352f"),gname:"商品2",pricebase:"200.1",discount:"0.2"},
//								{typeid:mongoose.Types.ObjectId("596e1773f99d950a343c3530"),gname:"商品3",pricebase:"300.1",discount:"0.3"},
//								{typeid:mongoose.Types.ObjectId("596e1773f99d950a343c3530"),gname:"商品4",pricebase:"400.1",discount:"0.4"},
//								{typeid:mongoose.Types.ObjectId("596e1773f99d950a343c3533"),gname:"商品5",pricebase:"500.1",discount:"0.5"},
//								{typeid:mongoose.Types.ObjectId("596e1773f99d950a343c3533"),gname:"商品6",pricebase:"600.1",discount:"0.6"},
//								{typeid:mongoose.Types.ObjectId("596e1773f99d950a343c3532"),gname:"商品7",pricebase:"700.1",discount:"0.7"},
//								{typeid:mongoose.Types.ObjectId("596e1773f99d950a343c3532"),gname:"商品8",pricebase:"800.1",discount:"0.8"}],
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
				orderitem.getOrderItemsByOid(data_getorder[0]._id, function(err_getorderitem, data_getorderitem){
					if (!err_getorderitem) {
						//遍历每个订单项
						for (var i = 0; i < data_getorderitem.length; i++) {
							var item = data_getorderitem[i];
							
							console.log(item);
							//取得订单项的商品价格基数
							var price = item.gid.pricebase;
							
							//取得订单项的商品规格数组
							var sizes = [];
							for (var j = 0; j < item.gsids.length; j++) {
								var sizeitem = item.gsids[j].gsid;
								
								//计算商品在此规格下价格偏移后的结果
								price = price + sizeitem.priceoffset;
								
								//将商品规格名加入数组
								sizes.push(sizeitem.gsname);
							}
							
							//计算订单项商品折扣
							price = (price*item.gid.discount).toFixed(2);
							
							//拼接每个订单项中所需数据
							var good = {otid: item._id,
										gid: item.gid._id,
										gname: item.gid.gname,
										gsizes: sizes,
										price: price,
										num: item.num};
										
							//加入商品列表
							goods.push(good);
							
						}
						
						res.send({type:"success", message:goods});
						
					} else{
						console.log(new Date() + "ERROR: " + err_getorderitem);
						res.send({type:"error", message:"获取订单项错误" });
						
					}
					
				});
				
			}
		} else{
			console.log(new Date() + "ERROR: " + err_getorder);
			res.send({type:"error", message: "获取订单错误" });
			
		}
	});
	
});

//获得商品订单项
router.get('/getorderitembyid/:otid', function(req, res, next) {
	var otid = req.params.otid;
	
	orderitem.getOrderItemById(otid, function(err, data){
		if (!err) {
			if (data.length != 0) {
				//获得订单项
				var item = data[0];
				
  				res.send(item);
			} else{
				console.log(new Date() + "ERROR: 订单项id有误");
				res.send("error");
			}
		}else {
			console.log(new Date() + "ERROR: " + err);
			res.send("error");
		}
	})
});

//修改订单项数量
router.post('/updateorderitem', function(req, res, next) {
	//获取表单数据
	var otid = req.body.otid;
	var num = req.body.num;
	
	orderitem.updateOrderItemNumById(otid, num, function(err){
		if (!err) {
			console.log(new Date() + "SUCCESS: 修改订单项数量成功");
			res.send({type:"success", message:"修改订单项数量成功"});
		}else {
			console.log(new Date() + "ERROR: " + err);
			res.send({type:"error", message:"修改订单项数量失败" });
		}
	})
	
});

//删除商品订单项
router.get('/deleteorderitembyid/:otid', function(req, res, next) {
	var otid = req.params.otid;
	
	orderitem.deleteOrderItemById(otid, function(err){
		if (!err) {
			console.log(new Date() + "SUCCESS: 删除商品订单项成功");
			res.send({type:"success", message:"删除商品订单项成功"});
		}else {
			console.log(new Date() + "ERROR: " + err);
			res.send({type:"error", message:"删除商品订单项失败" });
		}
	})
	
});

module.exports = router;
module.exports.callback = callback;