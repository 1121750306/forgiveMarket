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
function queryGoodList(page,rows,cb){
	var query=goodModel.find({});
	
	query.limit(Number(rows));//限制条数
	query.skip(Number((page-1)*rows));  //跳过几条开始数
	query.exec(cb);
}

/**
 *获取所有的商品 
 * @param {Object} cb
 */
function countGoodList(cb){
	goodModel.find({}).exec(cb);
}

/**
 * 通过id查询商品
 * @param {Object} id
 * @param {Object} callback
 */
function getGoodById(id, callback){
	goodModel.find({_id:id},callback);
}
/**
 * 通过id删除商品
 * @param {Object} id
 * @param {Object} cb
 */
function deleteGood(id,cb){
	goodModel.find({_id:id}).remove(cb);
}
/**
 * 跟新商品信息 
 * @param {Object} obj
 * @param {Object} cb
 */
function updateGood(obj,cb){
	goodModel.findById(obj._id,function(err,doc){
		if(!err){
			doc.gname=obj.gname;
			doc.pricebase=obj.pricebase;
			doc.discount=obj.discount;
			console.log("=================="+doc);
			doc.save(cb);
		}else{
			console.log(err);
		}
		
	})
}
module.exports.initModel = initModel;
module.exports.addGood = addGood;
module.exports.addGoods = addGoods;
module.exports.queryGoodList = queryGoodList;
module.exports.getGoodById = getGoodById;
module.exports.deleteGood = deleteGood;
module.exports.updateGood = updateGood;
module.exports.countGoodList=countGoodList;