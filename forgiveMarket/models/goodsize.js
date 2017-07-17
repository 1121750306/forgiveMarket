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

module.exports.initModel = initModel;
module.exports.addGoodSize = addGoodSize;