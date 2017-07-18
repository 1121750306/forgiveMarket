//注册models监听
function initModel(models) {
	//商品规格模型
    goodsizeModel =  models.goodsize;
}

/**
 * 添加商品规格
 * @param {Object} obj 商品规格记录
 * @param {Object} cb
 */
function addGoodSize(obj,cb){
	var goodSizeEntity=new goodsizeModel(obj);
	goodSizeEntity.save(cb);
}

/**
 * 添加多个商品规格
 * @param {Object} objs
 * @param {Object} cb
 */
function addGoodSizes(objs,cb){
	var goodSizeEntity;
	for(var i=0;i<objs.length;i++){
		goodSizeEntity=new goodsizeModel(objs[i]);
		goodSizeEntity.save(cb);
	}
}

/**
 * 通过id查找商品规格
 * @param {Object} id
 * @param {Object} callback
 */
function getGoodSizeById (id, callback) {
	goodsizeModel.find({_id:id},callback);
}

/**
 * 通过id删除商品规格
 * @param {Object} id
 * @param {Object} cb
 */
function deleteGoodSize(id,cb){
	goodsizeModel.findById(id,function(err,doc){
		if(!err){
			doc.remove();
			console.log(doc);
		}else{
			console.log(err);
		}
			
	})
}
module.exports.initModel = initModel;
module.exports.addGoodSize = addGoodSize;
module.exports.addGoodSizes = addGoodSizes;
module.exports.getGoodSizeById = getGoodSizeById;
module.exports.deleteGoodSize = deleteGoodSize;