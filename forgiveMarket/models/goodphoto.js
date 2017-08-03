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
	goodphotoModel.find({gid:id,flag:0},cb);
}
function checkDefault(gid,cb){
	goodphotoModel.find({gid:gid,url:'default.png'},cb);
}
/**
 * 检查图片是否存在
 * @param {Object} gid
 * @param {Object} url
 * @param {Object} cb
 */
function checkPhoto(gid,url,cb){
	goodphotoModel.find({gid:gid,url:url},cb);
}
function deletePhoto(gid,flag,cb){
	goodphotoModel.find({gid:gid,flag:flag}).remove(cb);
}
module.exports.initModel = initModel;
module.exports.addphoto = addphoto;
module.exports.getPhotoByGoodid = getPhotoByGoodid;
module.exports.getShowPhoto = getShowPhoto;
module.exports.checkPhoto = checkPhoto;
module.exports.checkDefault = checkDefault;
module.exports.deletePhoto = deletePhoto;