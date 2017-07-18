//注册models监听
function initModel(models) {
	//商品模型
    goodModel =  models.good;
}
/**
 * 
 * @param {Object} obj 商品对象
 * @param {Object} cb  回调函数
 */
function addGood(obj,cb){
 	var goodEntity=new goodModel(obj);	
 	goodEntity.save(cb);
}

/**
 * 批量添加商品
 * @param {Object} objs
 * @param {Object} callback
 */
function addGoods (objs, callback) {
	
	var err_callback;

	for (var i = 0; i < objs.length; i++) {
		
		var goodEntity = new goodModel(objs[i]);
		
		goodEntity.save(function(err){
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
 * 
 * @param {Object} cb 回调函数
 */
function queryGoodList(cb){
	var query=goodModel.find({});
	query.exec(cb);
}

/**
 * 通过id查询商品
 * @param {Object} id
 * @param {Object} callback
 */
function getGoodById(id, callback){
	goodModel.find({_id:id},callback);
}

module.exports.initModel = initModel;
module.exports.addGood = addGood;
module.exports.addGoods = addGoods;
module.exports.queryGoodList = queryGoodList;
module.exports.getGoodById = getGoodById;