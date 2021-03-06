var mongoose = require("mongoose");
//注册models监听
function initModel(models) {
	//浏览历史模型
	historyModel = models.history;
	goodModel = models.good;
}

/**
 * 添加一条浏览记录
 * @param {Object} uid 用户ID
 * @param {Object} gid 商品ID
 * @param {Object} date 日期
 * @param {Function(flag, err, result)} cb 回调(flag 0：失败  1：成功)
 */
function addHistory(uid, gid, date, cb) {
	console.log("date:" + date);
	historyModel.findOne({
		uid: uid,
		gid: gid
	}).exec(function(err, doc) {
		if(!err && doc) {
			//已存在
			doc.date = date.getTime();
			doc.save(function(err, data) {
				if(!err) {
					cb(1, null, data);
				} else {
					cb(0, err, null);
				}
			});
		} else {
			//不存在
			historyEntity = new historyModel({
				uid: uid,
				gid: mongoose.Types.ObjectId(gid),
				date: date.getTime()
			});
			//保存
			historyEntity.save(function(err, data) {
				if(!err) {
					cb(1, null, data);
				} else {
					cb(0, err, null);
				}
			});
		}
	});

}

/**
 * 查询所有浏览记录
 * @param {Object} uid 用户ID
 * @param {Object} index 获取的页数
 * @param {Object} cb 回调
 */
function queryHistory(uid, index, cb) {
	historyModel.find({
			uid: uid
		})
		.populate({
			path: 'gid'
		})
		.sort({
			date: -1
		})
		.exec(function(err, docs) {
			if(!err) {
				cb(1, null, docs);
			} else {
				cb(0, err, null);
			}
		});
}

module.exports.initModel = initModel;
module.exports.addHistory = addHistory;
module.exports.queryHistory = queryHistory;