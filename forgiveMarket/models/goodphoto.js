//注册models监听
function initModel(models) {
	//商品照片模型
    goodphotoModel =  models.goodphoto;
}

function addphoto(obj,cb){
	var goodphotoEntity=new goodphotoModel(obj);
	goodphotoEntity.save(cb);
}

module.exports.initModel = initModel;
module.exports.addphoto = addphoto;