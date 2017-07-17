//注册models监听
function initModel(models) {
	//订单模型
    orderModel =  models.order;
}


function addOrder (uid, flag, callback) {
	switch (flag){
		//购物车
		case 0:
			var orderEntity = new orderModel({
				uid: uid,
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
 * 查找订单
 * @param {Object} uid
 * @param {Object} flag
 * @param {Object} callback
 */
function getOrder (uid, flag, callback) {
	orderModel.find({
		uid: uid,
		flag: flag
	},callback);
}


module.exports.initModel = initModel;
module.exports.addOrder = addOrder;
module.exports.getOrder = getOrder;