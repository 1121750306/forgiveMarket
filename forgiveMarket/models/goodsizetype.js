//注册models监听
function initModel(models) {
	//商品规格类型模型
    goodsizetypeModel =  models.goodsizetype;
}

/**
 * 
 * @param {Object} obj 一条商品规格类型记录
 * @param {Object} cb 回调函数
 */
function addGoodSizeType(obj,cb){
	var goodsizeTypeEntity=new goodsizetypeModel(obj);
	goodsizeTypeEntity.save(cb);
}

function getGoodSizeTypes(cb){
	goodsizetypeModel.find({},cb);
}
module.exports.initModel = initModel;
module.exports.addGoodSizeType = addGoodSizeType;
module.exports.getGoodSizeTypes = getGoodSizeTypes;