//注册models监听
function initModel(models) {
	//评论模型
	commentPhotoModel = models.commentphoto;
}
/**
 * 保存图片
 * @param {Object} obj
 * @param {Object} cb
 */
function addCommentPhoto(obj,cb){
	var commentPhotoEntity=new commentPhotoModel(obj);
	commentPhotoEntity.save(cb);
}

module.exports.initModel = initModel;
module.exports.addCommentPhoto=addCommentPhoto;