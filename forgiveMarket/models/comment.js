//注册models监听
function initModel(models) {
	//评论模型
    commentModel =  models.comment;
}

/**
 * 添加一条评论
 * @param {Object} obj
 * @param {Object} cb
 */
function addComment(obj,cb){
	var commentEntity=new commentModel(obj);
	commentEntity.save(cb);
}
module.exports.initModel = initModel;
module.exports.addComment = addComment;