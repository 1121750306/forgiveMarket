//注册models监听
function initModel(models) {
	//商品照片模型
    goodphotoModel =  models.goodphoto;
}

function addphoto(obj,cb){
	var goodphotoEntity=new goodphotoModel(obj);
	goodphotoEntity.save(cb);
}

/**
 * 根据商品id获取所有图片
 * @param {Object} id商品id
 * @param {Object} cb
 */
function getPhotoByGoodid(id,cb){
	goodphotoModel.find({gid:id},cb);
}
/**
 * 根据商品id获取显示图片
 * @param {Object} id
 * @param {Object} cb
 */
function getShowPhoto(id,cb){
	goodphoto.find({gid:id,flag:0},cb);
}
module.exports.initModel = initModel;
module.exports.addphoto = addphoto;
module.exports.getPhotoByGoodid = getPhotoByGoodid;
module.exports.getShowPhoto = getShowPhoto;