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
	switch (parseInt(flag)) {
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
		if (!err) {
			if (doc != null) {
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

function createOrder(uid, otids, locationid, cb) {
	var orderEntity = new orderModel({
		uid: mongoose.Types.ObjectId(uid),
		flag: 2,
		locationid: mongoose.Types.ObjectId(String(locationid)),
		date: new Date()
	});
	orderEntity.save()
		.then(function(doc) {
			//创建成功
			console.log("创建成功：" + doc);
			//获取订单项
			promises = [];
			for (var i = 0; i < otids.length; i++) {
				promises.push(orderitemModel.findOneAndUpdate({
					_id: otids[i]
				}, {
					oid: doc._id
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
			cb(null, "创建订单成功");
		}, function(err) {
			//创建订单失败
			cb("创建订单失败", null);
		});
}

function getAllOrders(cb) {
	orderModel.find({}).exec(cb);
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
	}).then(function(result) {
		console.log("result:" + result);
		if (result == null || result.length == 0) {
			cb("没有订单", null);
			return;
		}
		var orders = [];
		var promises = [];
		for (var i = 0; i < result.length; i++) {
			orders[orders.length] = {
				oid: result[i]._id,
				date: result[i].date,
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
				path: 'gsids.gsid'
			});
		}
		promises[promises.length] = new Promise(function(resolve, reject) {
			resolve(orders);
		});
		return Promise.all(promises);
	}, function(err) {
		console.log("err:" + err);
		cb(err, null);
	}).then(function(result) {
		if (result == null || result.length == 0) {
			cb("没有订单", null);
			return;
		}
		var orders = result[result.length - 1];
		for (var i = 0; i < orders.length; i++) {
			orders[i].orderitem = [];
			orders[i].total = 0;
			if (result[i] == null || result[i].length == 0) {
				continue;
			}

			for (var j = 0; j < result[i].length; j++) {
				orders[i].orderitem[j] = {
						gid:result[i][j].gid._id,
						gname: result[i][j].gid.gname,
						price: result[i][j].gid.pricebase + result[i][j].gsids[0].gsid.priceoffset,
						type: result[i][j].gid.typeid.tname,
						number: result[i][j].num,
						gsizetype: result[i][j].gsids[0].gsid.type,
						gsizename: result[i][j].gsids[0].gsid.gsname
					}
					//计算总价
				orders[i].total += orders[i].orderitem[j].price * orders[i].orderitem[j].number;
			}

		}
		console.log("orders:" + orders);
		cb(null, orders);
	}, function(err) {
		console.log("err:" + err);
		cb(err, null);
	});
}

module.exports.initModel = initModel;
module.exports.addOrder = addOrder;
module.exports.getOrderByIdAndFlag = getOrderByIdAndFlag;
module.exports.updateOrder = updateOrder;
module.exports.createOrder = createOrder;
module.exports.getAllOrders = getAllOrders;
module.exports.getAllOrdersByFlag = getAllOrdersByFlag;