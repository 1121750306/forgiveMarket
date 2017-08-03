var mongoose = require("mongoose");
//注册models监听
function initModel(models) {
	//订单模型
	orderModel = models.order;
}

/**
 * 添加订单
 * @param {Object} uid
 * @param {Object} flag
 * @param {Object} callback
 */
function addOrder(uid, flag, callback) {
	switch(parseInt(flag)) {
		//购物车
		case 0:
			var orderEntity = new orderModel({
				uid: mongoose.Types.ObjectId(uid),
				flag: 0,
				date: new Date()
			});
			orderEntity.save(callback);
			break;
			//未付款
		case 1:
			break;
			//已付款
		case 2:
			break;
			//已发货
		case 3:
			break;
			//已收货
		case 4:
			break;
			//已收货
		case 5:
			break;
		default:
			break;
	}
}

/**
 * 通过id删除订单
 * @param {Object} oid
 * @param {Object} callback
 */
function deleteOrderById(id, callback) {
	orderModel.find({_id:id}, function(err, data){
		if (!err) {
			if (data.length != 0) {
				data[0].remove(callback);
			} else{
				callback("订单id有误");
			}
		}else {
			callback(err);
		}
	});
}

/**
 * 通过id和flag查找订单
 * @param {Object} uid
 * @param {Object} flag
 * @param {Object} callback
 */
function getOrderByIdAndFlag(uid, flag, callback) {
	orderModel.find({
		uid: uid,
		flag: flag
	}, callback);
}

/**
 * 修改订单状态
 * @param {Object} oid
 * @param {Object} flag
 * @param {Object} cb
 */
function updateOrder(oid, flag, cb) {
	orderModel.findOne({
		_id: oid
	}, function(err, doc) {
		if(!err) {
			if(doc != null) {
				doc.flag = Number(flag);
				doc.save(cb);
			} else {
				cb("不存在该订单", null);
			}
		} else {
			cb(err, null);
		}
	});
}

/**
 * 创建订单 
 * @param {Object} user
 * @param {Object} otids
 * @param {Object} locationid
 * @param {Object} cb
 */
function createOrder(user, otids, locationid, cb) {
	isEnough(user, otids, function(flag) {
		if(flag == 2) {
			cb("库存不足", null);
			return;
		}
		if(flag == 3) {
			cb("无法创建订单", null);
			return;
		}

		var orderEntity = new orderModel({
			uid: mongoose.Types.ObjectId(user._id),
			flag: 1,
			locationid: mongoose.Types.ObjectId(String(locationid)),
			date: new Date()
		});
		orderEntity.save().then(function(doc) {
			//创建成功
			//获取订单项
			promises = [];
			for(var i = 0; i < otids.length; i++) {
				promises.push(orderitemModel.findOneAndUpdate({
					_id: otids[i]
				}, {
					oid: doc._id
				}).populate({
					path: 'gsids.gsid'
				}));
			}
			promises.push(new Promise(function(resolve, reject) {
				resolve(doc);
			}));
			return Promise.all(promises);
		}, function(err) {
			//创建订单失败
			cb("创建订单失败", null);
		}).then(function(result) {
			//更新规格的库存和销量
			promises = [];
			for(var i = 0; i < result.length - 1; i++) {
				promises.push(goodsizeModel.findOneAndUpdate({
					_id: result[i].gsids[0].gsid
				}, {
					lefts: result[i].gsids[0].gsid.lefts - result[i].num,
					sales: result[i].gsids[0].gsid.sales + result[i].num
				}));
			}
			promises.push(new Promise(function(resolve, reject) {
				resolve(result[result.length - 1]);
			}));
			return Promise.all(promises);
		}, function(err) {
			//创建订单失败
			cb("创建订单失败", null);
		}).then(function(result) {
			cb(null, result[result.length - 1]);
		}, function(err) {
			//创建订单失败
			cb("创建订单失败", null);
		});
	});

}

/**
 * 判断库存是否足够
 * @param {Object} uid
 * @param {Object} otids
 * @param {Object} cb(flag) flag 1 可以创建订单  2 库存不足 3 无法创建
 */
function isEnough(user, otids, cb) {
	promises = [];
	for(var i = 0; i < otids.length; i++) {
		promises.push(orderitemModel.findOne({
			_id: otids[i]
		}).populate({
			path: 'gsids.gsid'
		}).populate({
			path: 'gid'
		}));
	}
	promises.push(new Promise(function(resolve, reject) {
		resolve(otids);
	}));
	Promise.all(promises)
		.then(function(result) {
			console.log("isEnough:" + result);
			//判断库存是否足够
			var isEnough = true;
			for(var i = 0; i < result.length - 1; i++) {
				if(result[i].gsids[0].gsid.lefts - result[i].num < 0) {
					isEnough = false;
				}
			}
			console.log("是否足够:" + isEnough);
			if(!isEnough) {
				cb(2);
				return;
			}
			cb(1);
		}, function(err) {
			cb(3);
		});
}

/**
 * 获取所有订单数据
 * @param {Object} cb
 */
function getAllOrders(cb) {
	orderModel.find({
		flag: 2
	}).exec(cb);
}

/**
 * 支付
 * @param {Object} user
 * @param {Object} oid
 * @param {Object} cb
 */
function pay(user, oid, cb) {
	orderitemModel.find({
		oid: oid
	}).populate({
		path: 'gsids.gsid'
	}).populate({
		path: 'gid'
	}).then(function(result){
		console.log(result);
		var total = 0;
		for(var i = 0; i < result.length; i++){
			
		}
	},function(err){
		console.log(err);
	});
	cb(200,null);
}

/**
 * 获取某个状态的所有订单 
 * @param {Object} uid
 * @param {Object} flag
 * @param {Object} cb
 */
function getAllOrdersByFlag(uid, flag, cb) {
	orderModel.find({
		uid: uid,
		flag: flag
	}).populate({
		path: 'locationid'
	}).sort({
		date: '-1'
	}).then(function(result) {
		if(result == null || result.length == 0) {
			cb("没有订单", null);
			return;
		}
		var orders = [];
		var promises = [];
		for(var i = 0; i < result.length; i++) {

			var date = result[i].date.getFullYear() + "-" + (result[i].date.getMonth() + 1) + "-" + result[i].date.getDate() + " " + result[i].date.getHours() + ":" + result[i].date.getMinutes() + ":" + result[i].date.getSeconds();

			orders[orders.length] = {
				oid: result[i]._id,
				date: date,
				locationid: result[i].locationid
			}
			promises[promises.length] = orderitemModel.find({
				oid: result[i]._id
			}).populate({
				path: 'gid',
				populate: {
					path: 'typeid',
					select: 'tname'
				}
			}).populate({
				path: 'cid',
				select: 'content date photos'
			}).populate({
				path: 'gsids.gsid'
			});
		}
		promises[promises.length] = new Promise(function(resolve, reject) {
			resolve(orders);
		});
		return Promise.all(promises);
	}, function(err) {
		cb(err, null);
	}).then(function(result) {
		if(result == null || result.length == 0) {
			cb("没有订单", null);
			return;
		}
		var orders = result[result.length - 1];
		for(var i = 0; i < orders.length; i++) {

			orders[i].orderitem = [];
			orders[i].total = 0;
			if(result[i] == null || result[i].length == 0) {
				continue;
			}

			for(var j = 0; j < result[i].length; j++) {
				var date = null;
				if(result[i][j].cid != undefined && result[i][j].cid != null) {
					date = result[i][j].cid.date.getFullYear() + "-" + (result[i][j].cid.date.getMonth() + 1) + "-" + result[i][j].cid.date.getDate() + " " + result[i][j].cid.date.getHours() + ":" + result[i][j].cid.date.getMinutes() + ":" + result[i][j].cid.date.getSeconds();
				}
				console.log("photos:  " + result[i][j].cid);
				orders[i].orderitem[j] = {
					otid: result[i][j]._id,
					gid: result[i][j].gid._id,
					gname: result[i][j].gid.gname,
					price: result[i][j].gid.pricebase + result[i][j].gsids[0].gsid.priceoffset,
					type: result[i][j].gid.typeid.tname,
					number: result[i][j].num,
					gsizetype: result[i][j].gsids[0].gsid.type,
					gsizename: result[i][j].gsids[0].gsid.gsname,
					cid: result[i][j].cid == undefined || result[i][j].cid == null ? null : {
						cid: result[i][j].cid._id,
						content: result[i][j].cid.content,
						date: date,
						photo: result[i][j].cid.photos
					}
				}
				//计算总价
				orders[i].total += orders[i].orderitem[j].price * orders[i].orderitem[j].number;
			}

		}
		cb(null, orders);
	}, function(err) {
		cb(err, null);
	});
}

function getOrderNumber(uid, cb) {
	var promises = [];
	for(var i = 1; i <= 5; i++) {
		promises[promises.length] = new Promise(function(resolve, reject) {
			getAllOrdersByFlag(uid, i, function(err, orders) {
				if(orders == null) {
					resolve({
						number: 0
					});
				} else {
					resolve(orders == null ? {
						number: 0
					} : {
						number: orders.length
					});
				}
			});
		});
	}
	Promise.all(promises).then(function(result) {
		cb(null, result);
	}, function(err) {
		cb(err, null);
	})
}

module.exports.initModel = initModel;
module.exports.deleteOrderById = deleteOrderById;
module.exports.addOrder = addOrder;
module.exports.getOrderByIdAndFlag = getOrderByIdAndFlag;
module.exports.updateOrder = updateOrder;
module.exports.createOrder = createOrder;
module.exports.getAllOrders = getAllOrders;
module.exports.getAllOrdersByFlag = getAllOrdersByFlag;
module.exports.getOrderNumber = getOrderNumber;
module.exports.pay = pay;