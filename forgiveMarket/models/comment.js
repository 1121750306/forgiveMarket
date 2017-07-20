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
	if(!Array.isArray(cids)){
				console.log('不是数组，转为数组');
				cids = [cids[0]];
			}else{
				console.log(cids.length)
			}
			console.log(cids)
	console.log("//////////"+cids)
	var docss = cids.map(function(value, index, arr) {
		commentModel.find({
			cid: value._id
		})
		.populate({
			path:'uid'
		})
		.exec(function(err,docs){
			var obj = value;
			if(!err){
				
				obj.sonComment = docs[0];
				obj.text = '11'
				console.log('********'+value.content)
				console.log('********'+obj)
				
			}else{
				console.log('查找子评论错误');
				errs = err;
			}
			time++;
			
			return obj;
		})
	});
	var timet = 0;
	var t = setTimeout(function(){
		console.log(time+"   "+size);
		if(time>=size){
			console.log("----------"+docss)
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