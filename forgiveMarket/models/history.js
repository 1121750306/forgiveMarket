//注册models监听
function initModel(models) {
	//浏览历史模型
	historyModel = models.history;
}

/**
 * 添加一条浏览记录
 * @param {Object} uid 用户ID
 * @param {Object} gid 商品ID
 * @param {Object} date 日期
 * @param {Function(flag, err, result)} cb 回调(flag 0：失败  1：成功)
 */
function addHistory(uid, gid, date, cb) {

	historyEntity = new historyModel({
		uid: uid,
		gid: gid,
		date: date
	});
	//保存
	historyEntity.save(function(err, data) {
		if (!err) {
			cb(1, null, data);
		} else {
			cb(0, err, null);
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
	console.log("进入register");
	userModel.find({
		uid: uid
	}).limit(10).skip(index * 10).exec(function(err, docs) {
		if (!err) {
			cb(1, null, docs);
		} else {
			cb(0, err, null);
		}
	});
}

module.exports.initModel = initModel;
module.exports.addHistory = addHistory;
module.exports.queryHistory = queryHistory;