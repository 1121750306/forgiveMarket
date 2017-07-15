//注册models监听
function initModel(models) {
	//商品模型
    goodModel =  models.good;
}

 function addGood(obj,cb){
 	var goodEntity=new goodModel(obj);
 	
 	goodEntity.save(cb);
 }

module.exports.initModel = initModel;
module.exports.addGood = addGood;