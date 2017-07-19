//注册models监听
function initModel(models) {
	//商品规格模型
	goodsizeModel = models.goodsize;
}

/**
 * 添加商品规格
 * @param {Object} obj 商品规格记录
 * @param {Object} cb
 */
function addGoodSize(obj, cb) {
	var goodSizeEntity = new goodsizeModel(obj);
	goodSizeEntity.save(cb);
}

/**
 * 添加多个商品规格
 * @param {Object} objs
 * @param {Object} cb
 */
function addGoodSizes(objs, cb) {
	var goodSizeEntity;
	for(var i = 0; i < objs.length; i++) {
		goodSizeEntity = new goodsizeModel(objs[i]);
		goodSizeEntity.save(cb);
	}
}

/**
 * 通过id查找商品规格
 * @param {Object} id
 * @param {Object} callback
 */
function getGoodSizeById(id, callback) {
	goodsizeModel.find({
		_id: id
	}, callback);
}

/**
 * 通过id删除商品规格
 * @param {Object} id
 * @param {Object} cb
 */
function deleteGoodSize(id, cb) {
	goodsizeModel.find({
		gid: id
	}).remove(cb);
}
/**
 *通过goodid茶找商品规格 
 * @param {Object} id
 * @param {Object} cb
 */
function QuerySizeByid(id, cb) {
	var query = goodsizeModel.find({
		gid: id
	});
	query.sort({
		type: 'desc'
	});
	query.exec(cb);
}
/**
 * 跟新多条规格 
 * @param {Object} objs
 * @param {Object} cb
 */
function UpdateGoodSizes(objs, cb) {
	console.log("UpdateGoodsize=============s");
	for(var i = 0; i < objs.length; i++) {
		(function(i) {
			goodsizeModel.findOne({
				gid: objs[i].gid,
				gsname: objs[i].gsname
			}, function(err, doc) {
				console.log("i:================================" + i);
				if(!err) {
					doc.priceoffset = objs[i].priceoffset;
					doc.lefts = objs[i].lefts;
					console.log("==================" + doc);
					doc.save();
				} else {
					console.log(err);
				}

			})
		})(i)

	}
}
module.exports.initModel = initModel;
module.exports.addGoodSize = addGoodSize;
module.exports.addGoodSizes = addGoodSizes;
module.exports.getGoodSizeById = getGoodSizeById;
module.exports.QuerySizeByid = QuerySizeByid;
module.exports.deleteGoodSize = deleteGoodSize;
/*module.exports.UpdateGoodSize = UpdateGoodSize;*/
module.exports.UpdateGoodSizes = UpdateGoodSizes;