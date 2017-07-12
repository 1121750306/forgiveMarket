//注册models监听
function initModel(models) {
	//收货地址模型
    locationModel =  models.location;
}

function addLocation(obj,cb) {
	var locationEntity = new locationModel(obj);

	//保存
	locationEntity.save(cb);
}


module.exports.initModel = initModel;
module.exports.addLocation=addLocation;