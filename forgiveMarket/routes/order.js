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
	var num = parseInt(req.body.num);

	order.getOrderByIdAndFlag(uid, 0, function(err_getorder, data_getorder) {
		if (!err_getorder) {
			if (data_getorder.length != 0) {
				//已创建购物车
				//获得购物车id
				var oid = data_getorder[0]._id;

				//封装商品规格信息
				var temp = [];
				for (var i = 0; i < gsids.length; i++) {
					temp.push({
						gsid: mongoose.Types.ObjectId(gsids[i])
					})
				}
				gsids = temp;
				
				//查询该商品规格的商品是否已经存在于购物车中
				orderitem.getOrderItemByOidGIdGsids(oid, gid, gsids, function(err, data){
					if (!err) {
						if (data == "nofound") {
							//不存在于购物车中
							//添加商品订单项
							orderitem.addOrderItem({
								oid: mongoose.Types.ObjectId(oid),
								gid: mongoose.Types.ObjectId(gid),
								gsids: gsids,
								num: num
							}, function(err_addorder, doc) {
								if (!err_addorder) {
									//添加成功	
									res.send({
										type: "success",
										message: "商品订单项添加成功",
										otid: doc._id
									});
								} else {
									console.log(new Date() + "ERROR: 商品订单项添加失败");
									console.log(new Date() + "ERROR CONTENT: " + err_addorder);
									res.send({
										type: "error",
										message: "商品订单项添加失败"
									});
								}
							});
							
						}else{
							//存在于购物车中		
							//修改商品订单项
							orderitem.updateOrderItemNumById(data._id, parseInt(data.num) + num, function(err) {
								if (!err) {
									console.log(new Date() + "SUCCESS: 修改购物车订单项数量成功");
									res.send({
										type: "success",
										message: "修改购物车订单项数量成功",
										otid: data._id
									});
								} else {
									console.log(new Date() + "ERROR: " + err);
									res.send({
										type: "error",
										message: "修改购物车订单项数量失败"
									});
								}
							});
							
						}
						
					}else{
						console.log(err);
					}
					
				});


			} else {
				//未创建购物车
				res.send({
					type: "error",
					message: "购物车未创建"
				});

			}
		} else {
			console.log(new Date() + "ERROR: " + err_getorder);
			res.send({
				type: "error",
				message: "购物车搜索错误"
			});
		}
	});

});

//获得关于用户的订单项
router.get('/getorderitembyuser/:uid/:flag', function(req, res, next) {
	var uid = req.params.uid;
	var flag = req.params.flag;
	var goods = [];
	//查询是否已经创建订单
	order.getOrderByIdAndFlag(uid, flag, function(err_getorder, data_getorder) {
		if (!err_getorder) {
			if (data_getorder.length == 0) {
				//未创建
				order.addOrder(uid, flag, function(err_addorder) {
					if (!err_addorder) {
						res.send({
							type: "error",
							message: "订单不存在，现已创建成功"
						});

					} else {
						res.send({
							type: "error",
							message: "订单不存在，创建失败"
						});
						console.log(new Date() + "ERROR: 订单创建失败");
						console.log(new Date() + "ERROR CONTENT: " + err_addorder);

					}
				});

			} else {
				//已创建
				//获得订单id
				var oid = data_getorder[0]._id;

				var goods = [];
				//获取所有订单项
				orderitem.getOrderItemsByOid(data_getorder[0]._id, function(err_getorderitem, data_getorderitem) {
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
							price = (price * item.gid.discount).toFixed(2);

							//拼接每个订单项中所需数据
							var good = {
								otid: item._id,
								gid: item.gid._id,
								gname: item.gid.gname,
								gsizes: sizes,
								price: price,
								num: item.num
							};

							//加入商品列表
							goods.push(good);

						}

						res.send({
							type: "success",
							message: goods
						});

					} else {
						console.log(new Date() + "ERROR: " + err_getorderitem);
						res.send({
							type: "error",
							message: "获取订单项错误"
						});

					}

				});

			}
		} else {
			console.log(new Date() + "ERROR: " + err_getorder);
			res.send({
				type: "error",
				message: "获取订单错误"
			});

		}
	});

});

//获得商品订单项
router.get('/getorderitembyid/:otid', function(req, res, next) {
	var otid = req.params.otid;

	orderitem.getOrderItemById(otid, function(err, data) {
		if (!err) {
			if (data.length != 0) {
				//获得订单项
				var item = data[0];

				res.send(item);
			} else {
				console.log(new Date() + "ERROR: 订单项id有误");
				res.send("error");
			}
		} else {
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

	orderitem.updateOrderItemNumById(otid, num, function(err) {
		if (!err) {
			console.log(new Date() + "SUCCESS: 修改订单项数量成功");
			res.send({
				type: "success",
				message: "修改订单项数量成功"
			});
		} else {
			console.log(new Date() + "ERROR: " + err);
			res.send({
				type: "error",
				message: "修改订单项数量失败"
			});
		}
	});

});

//删除商品订单项
router.get('/deleteorderitembyid/:otid', function(req, res, next) {
	var otid = req.params.otid;

	orderitem.deleteOrderItemById(otid, function(err) {
		if (!err) {
			console.log(new Date() + "SUCCESS: 删除商品订单项成功");
			res.send({
				type: "success",
				message: "删除商品订单项成功"
			});
		} else {
			console.log(new Date() + "ERROR: " + err);
			res.send({
				type: "error",
				message: "删除商品订单项失败"
			});
		}
	})

});

//修改订单状态
router.post('/updateorder', function(req, res, next) {
	var otid = req.body.otid;
	var flag = req.body.flag;

	order.updateOrder(otid, flag, function(err, doc) {
		if (!err) {
			console.log(new Date() + "SUCCESS: 修改订单成功");
			res.send({
				type: "success",
				message: "修改订单成功",
				result: doc
			});
		} else {
			console.log(new Date() + "ERROR: " + err);
			res.send({
				type: "error",
				message: "删除商品订单项失败"
			});
		}
	})
});

//创建订单
router.post('/createorder', function(req, res, next) {
	var uid = req.session.user[0]._id;
	var locationid = req.body.locationid;
	var otids = JSON.parse(req.body.otids);
	otids = otids.otid;
	console.log("otids:" + otids);
	console.log("locationid:" + locationid);
	order.createOrder(uid, otids, locationid, function(err, result) {
		console.log(result);
		if (!err) {
			res.send({
				flag: 200,
				result: result
			});
		} else {
			res.send({
				flag: 300,
				msg: err
			});
		}

	});
	//	console.log("uid:" + uid);

});

/**
 * 获取所有订单（不关乎uid）
 */
router.get('/getallorders', function(req, res, next) {
	order.getAllOrders(function(err, docs) {
		if (!err) {
			res.send({
				flag: 200,
				result: docs
			});
		} else {
			res.send({
				flag: 300,
				result: null
			});
		}
	})
});

/**
 * 根据订单状态获取当下状态的所有订单
 */
router.post('/getallordersbyflag', function(req, res, next) {
	if (req.session.user == null) {
		res.send({
			flag: 300,
			msg: "未登录"
		});
		return;
	}
	var uid = req.session.user[0]._id;
	var flag = req.body.flag;
	order.getAllOrdersByFlag(uid, flag, function(err, docs) {
		if (!err) {
			res.send({
				flag: 200,
				result: docs
			});
		} else {
			res.send({
				flag: 300,
				result: null
			});
		}
	});
});

module.exports = router;
module.exports.callback = callback;