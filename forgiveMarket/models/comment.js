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
	console.log(obj)
	var commentEntity = new commentModel(obj);
	commentEntity.save(cb);
}

function addThumbById(cid, uid, cb) {
	commentModel.find({
		_id: cid
	}).exec(function(err, docs) {
		console.log('点赞' + docs);
		console.log(docs[0].thumb.length)
		docs[0].thumb.push(uid);
		docs[0].save(cb(err, docs));
	})
}

function getCommentByGid(gid, cb) {
	commentModel.find({
			gid: gid
		})
		.populate({
			path: 'uid'
		})
		.sort({
			date: '-1'
		})
		.exec(function(err, docs) {
			cb(err, docs)
		})
}

function getCommentByCids(cids, cb) {
	var size = cids.length;
	var time = 0;
	var errs;
	
	var str = JSON.stringify(cids);
	var obj = JSON.parse(str);
	
	var promises = [];
	for(var i = 0; i < size; i++) {
		promises.push(
			commentModel.find({
				cid: cids[i]._id
			})
			.populate({
				path: 'uid'
			})
		);
	}
		console.log(promises[0])
	promises.push(new Promise(function(resolve, reject) {
		resolve('5');
	}))
	Promise.all(promises).then(function(data) {
		for(var k = 0 ; k <size;k++){
			obj[k].sonComment = data[k];
		}
		
		console.log(data);
		cb('', obj);
	}, function(err) {
		console.log(err);
		cb('错误', []);
	})
	//	if(!Array.isArray(cids)){
	//				console.log('不是数组，转为数组');
	//				cids = [cids[0]];
	//			}else{
	////				console.log(cids.length)
	//			}
	////			console.log(cids)
	////	console.log("//////////"+cids);
	//	
	//	var docss = [];
	//	cids.forEach(function(value, index, arr) {
	//		commentModel.find({
	//			cid: value._id
	//		})
	//		.populate({
	//			path:'uid'
	//		})
	//		.exec(function(err,docs){
	//			var obj = JSON.stringify(value);
	//			obj = JSON.parse(obj);
	//			if(!err){
	//				console.log(docs)
	//				obj.sonComment = docs;
	//				obj.text = '11'
	////				console.log('********'+value)
	////				console.log('********'+obj)
	//				docss.push(obj)
	////				console.log("------------------"+docss)
	//			}else{
	//				console.log('查找子评论错误');
	//				errs = err;
	//			}
	//			time++;
	//			
	//		})
	//	});
	//	var timet = 0;
	//	var t = setTimeout(function(){
	//		console.log(time+"   "+size);
	//		if(time>=size){
	////			console.log("----------"+docss)
	//			cb(errs,docss);
	//		}else if(timet<100){
	//			clearTimeout(t);
	//			timet++;
	//			t = setTimeout(arguments.callee,10)
	//		}else{
	//			cb('map循环错误',docss);
	//		}
	//	},10)
}
module.exports.initModel = initModel;
module.exports.addComment = addComment;
module.exports.getCommentByGid = getCommentByGid;
module.exports.getCommentByCids = getCommentByCids;
module.exports.addThumbById = addThumbById;