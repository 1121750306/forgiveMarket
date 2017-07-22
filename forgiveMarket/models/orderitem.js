
var mongoose = require("mongoose");
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
 * 通过oid,gid,gsids查找订单项
 * @param {Object} oid
 * @param {Object} gid
 * @param {Object} gsids
 * @param {Object} callback
 */
function getOrderItemByOidGIdGsids (oid, gid, gsids, callback) {
	orderitemModel.find({
		oid:oid,
		gid:gid
	}).populate({
		path: 'oid' 
	}).populate({
		path: 'gid' 
	}).populate({
		path: 'gsids.gsid'
	}).exec(function(err, data){
		if (!err) {
			var orderitem;
			var founded = false;
			for (var i = 0; i < data.length; i++) {
				if (gsids.length == data[i].gsids.length) {
					for (var j = 0; j < gsids.length; j++) {
						founded = false;
						for (var k = 0; k < data[i].gsids.length; k++) {
							if (gsids[j].gsid == data[i].gsids[k].gsid._id.toString()) {
								founded = true;
								break;
							}
						}
						if (!founded) {
							break;
						}
					}
					if (founded) {
						orderitem = data[i];
						break;
					}
				}
			}
			if (founded) {
				callback(err, orderitem);
			}else{
				callback(err, "nofound");
			}
		} else{
			callback(err, "error");
		}
	});
	
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
/**
 * 添加评论id 
 * @param {Object} obj
 * @param {Object} cb
 */
function updateOrderItem(obj,cb){
	orderitemModel.findById(obj._id,function(err,doc){
		if(!err){
			doc.cid=obj.cid;
			doc.save(cb);			
		}else{
			console.log(err);
		}

	})
}

module.exports.initModel = initModel;
module.exports.addOrderItem = addOrderItem;
module.exports.addOrderItems = addOrderItems;
module.exports.getOrderItemById = getOrderItemById;
module.exports.getOrderItemsByOid = getOrderItemsByOid;
module.exports.getOrderItemByOidGIdGsids = getOrderItemByOidGIdGsids;
module.exports.updateOrderItemNumById = updateOrderItemNumById;
module.exports.deleteOrderItemById = deleteOrderItemById;
module.exports.getAllOrderItem = getAllOrderItem;
module.exports.updateOrderItem = updateOrderItem;
