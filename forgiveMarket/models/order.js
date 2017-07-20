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
	orderModel.findOneAndUpdate({
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

module.exports.initModel = initModel;
module.exports.addOrder = addOrder;
module.exports.getOrderByIdAndFlag = getOrderByIdAndFlag;
module.exports.updateOrder = updateOrder;