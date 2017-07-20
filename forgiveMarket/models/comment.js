//注册models监听
function initModel(models) {
	//评论模型
	commentModel = models.comment;
}

/**
 * 添加一条评论
 * @param {Object} obj
 * @param {Object} cb
 */
function addComment(obj, cb) {
	var commentEntity = new commentModel(obj);
	commentEntity.save(cb);
}

function getCommentByGid(gid, cb) {
	commentModel.find({
			gid: gid
		})
		.populate({
			path: 'uid'
		})
		.exec(function(err, docs) {
			cb(err, docs)
		})
}

function getCommentByCids(cids, cb) {
	var size = cids.length;
	var time = 0;
	var errs ;
	var docss = cids.map(function(value, index, arr) {
		commentModel.find({
			cid: value._id
		})
		.populate({
			path:'uid'
		})
		.exec(function(err,docs){
			if(!err){
				value.sonComment = docs;
			}else{
				console.log('查找子评论错误');
				errs = err;
			}
			time++;
			return value;
		})
	});
	var timet = 0;
	var t = setTimeout(function(){
		console.log(time+"   "+size);
		if(time>=size){
			cb(errs,docss);
		}else if(timet<100){
			clearTimeout(t);
			timet++;
			t = setTimeout(arguments.callee,10)
		}else{
			cb('map循环错误',docss);
		}
	},10)
}
module.exports.initModel = initModel;
module.exports.addComment = addComment;
module.exports.getCommentByGid = getCommentByGid;
module.exports.getCommentByCids = getCommentByCids;