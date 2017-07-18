var mongoose = require("mongoose");
//注册models监听
function initModel(models) {
	//收藏模型
    collectModel =  models.collect;
    goodModel = models.good;
}

/**
 * 添加一条收藏
 * @param {Object} uid 用户ID
 * @param {Object} gid 商品ID
 * @param {Object} date 日期
 * @param {Function(flag, err, result)} cb 回调(flag 0：失败  1：成功)
 */
function addCollect(uid, gid, date, cb) {
	console.log("date:" + date);
	collectEntity = new collectModel({
		uid: uid,
		gid: mongoose.Types.ObjectId(gid),
		date: date.getTime()
	});
	//保存
	collectEntity.save(function(err, data) {
		if (!err) {
			cb(1, null, data);
		} else {
			cb(0, err, null);
		}
	});
}

/**
 * 查询所有收藏
 * @param {Object} uid 用户ID
 * @param {Object} index 获取的页数
 * @param {Object} cb 回调
 */
function queryCollect(uid, index, cb) {
	console.log("queryCollect");
	collectModel.find({
			uid: uid
		})
		.populate({
			path: 'gid',
			populate:{
				path:'typeid'
			}
		})
		//		.limit(10)
		//		.skip(index * 10)
		.sort({
			date: -1
		})
		.exec(function(err, docs) {
			if (!err) {
				cb(1, null, docs);
			} else {
				cb(0, err, null);
			}
		});
}

module.exports.initModel = initModel;
module.exports.addCollect = addCollect;
module.exports.queryCollect = queryCollect;
