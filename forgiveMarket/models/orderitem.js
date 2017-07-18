//注册models监听
function initModel(models) {
	//订单项模型
    orderitemModel =  models.orderitem;
}

/**
 * 添加订单项
 * @param {Object} obj
 * @param {Object} callback
 */
function addOrderItem (obj, callback) {
	var orderitemEntity = new orderitemModel(obj);
	
	orderitemEntity.save(callback);
}

/**
 * 批量添加订单项
 * @param {Object} objs
 * @param {Object} callback
 */
function addOrderItems (objs, callback) {
	
	var err_callback;

	for (var i = 0; i < objs.length; i++) {
		
		var orderitemEntity = new orderitemModel(objs[i]);
		
		orderitemEntity.save(function(err){
			if (err) {
				err_callback = err;
			}
		});
		
		if (err_callback) {
			break;
		}
	}
	
	callback(err_callback);
}

/**
 * 查找订单项
 * @param {Object} oid
 * @param {Object} callback
 */
function getOrderItem (oid, callback) {
	orderitemModel.find({
		oid:oid
	}).populate({
		path: 'oid' 
	}).populate({
		path: 'gid' 
	}).populate({
		path: 'gsids.gsid'
	}).exec(callback);
}

/**
 * 通过id删除订单项
 * @param {Object} id
 * @param {Object} callback
 */
function deleteOrderItemById(id, callback){
	orderitemModel.find({_id:id},callback);
}

module.exports.initModel = initModel;
module.exports.addOrderItem = addOrderItem;
module.exports.addOrderItems = addOrderItems;
module.exports.getOrderItem = getOrderItem;
module.exports.deleteOrderItemById = deleteOrderItemById;