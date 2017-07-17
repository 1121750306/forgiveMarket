//注册models监听
function initModel(models) {
	//商品类型模型
    goodtypeModel =  models.goodtype;
}

/**
 * 添加商品类型
 * @param {Object} tname
 */
function addGoodType (tname) {
  			
	var goodtypeEntity = new goodtypeModel({
		tname:tname
	});
	
	goodtypeEntity.save(function(err, data){
		if (!err) {
			console.log("SUCCESS: " + "good type added");
			console.log(data);
		}else{
			console.log("ERROR: " + err.message);
		}
	});
}

/**
 * 添加多个商品类型
 * @param {Object} tnames
 */
function addGoodTypes (tnames) {
	
	for (var i = 0; i < tnames.length; i++) {
		
		var goodtypeEntity = new goodtypeModel({
			tname:tnames[i]
		});
		
		goodtypeEntity.save(function(err, data){
			if (!err) {
//						console.log("SUCCESS: " + "good type added");
				console.log(data);
			}else{
				console.log("ERROR: " + err.message);
			}
		})
	}
}

/**
 * 获得所有商品类型
 * @param {Object} callback
 */
function getGoodTypes (callback) {
	goodtypeModel.find({},callback);
}

/**
 * 通过id获得商品类型
 * @param {Object} id
 * @param {Object} callback
 */
function getGoodType (id,callback){
	goodtypeModel.find({_id:id},callback);
}

/**
 * 获取uuid32 id
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

module.exports.initModel = initModel;
module.exports.addGoodType = addGoodType;
module.exports.addGoodTypes = addGoodTypes;
module.exports.getGoodType = getGoodType;
module.exports.getGoodTypes = getGoodTypes;