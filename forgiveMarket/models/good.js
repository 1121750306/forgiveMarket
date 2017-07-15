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
 * 
 * @param {Object} cb 回调函数
 */
function queryGoodList(cb){
	var query=goodModel.find({});
	query.exec(cb);
}
module.exports.initModel = initModel;
module.exports.addGood = addGood;
module.exports.queryGoodList = queryGoodList;