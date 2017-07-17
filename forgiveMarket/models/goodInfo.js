//注册models监听
function initModel(models) {
	//商品信息模型
    goodInfoModel =  models.goodInfo;
}
/**
 * 
 * @param {Object} obj 一条=商品信息记录
 * @param {Object} cb 回调函数
 */
function addGoodInfo(obj,cb){
	var goodInfoEntity=new goodInfoModel(obj);
	 goodInfoEntity.save(cb);
}

module.exports.initModel = initModel;
module.exports.addGoodInfo = addGoodInfo;