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
 * 通过id查找订单项
 * @param {Object} id
 * @param {Object} callback
 */
function getOrderItemById (id, callback) {
	orderitemModel.find({
		_id:id
	}).populate({
		path: 'oid' 
	}).populate({
		path: 'gid' 
	}).populate({
		path: 'gsids.gsid'
	}).exec(callback);
}
/**
 * 获取所有的订单项 
 * @param {Object} cb
 */
function getAllOrderItem(cb){
	orderitemModel.find({}).populate({
		path: 'oid' 
	}).populate({
		path: 'gid' 
	}).populate({
		path: 'gsids.gsid'
	}).exec(cb);
}
/**
 * 通过oid查找订单项
 * @param {Object} oid
 * @param {Object} callback
 */
function getOrderItemsByOid (oid, callback) {
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
   * 通过id修改订单项数量
   * @param {Object} id
   * @param {Object} num
   * @param {Object} callback
   */
function updateOrderItemNumById (id, num, callback) {
	orderitemModel.find({_id:id},function(err, data){
		if (!err) {
			if (data.length != 0) {
				
				data[0].num = num;
				
				data[0].save(callback);
			} else{
				callback("订单项id有误");
			}
		}else {
			callback(err);
		}
	});
}

/**
 * 通过id删除订单项
 * @param {Object} id
 * @param {Object} callback
 */
function deleteOrderItemById(id, callback){
	orderitemModel.find({_id:id}, function(err, data){
		if (!err) {
			if (data.length != 0) {
				data[0].remove(callback);
			} else{
				callback("订单项id有误");
			}
		}else {
			callback(err);
		}
	});
}

module.exports.initModel = initModel;
module.exports.addOrderItem = addOrderItem;
module.exports.addOrderItems = addOrderItems;
module.exports.getOrderItemById = getOrderItemById;
module.exports.getOrderItemsByOid = getOrderItemsByOid;
module.exports.updateOrderItemNumById = updateOrderItemNumById;
module.exports.deleteOrderItemById = deleteOrderItemById;
module.exports.getAllOrderItem = getAllOrderItem;
