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
module.exports.initModel = initModel;
module.exports.addGoodSize = addGoodSize;
module.exports.addGoodSizes = addGoodSizes;