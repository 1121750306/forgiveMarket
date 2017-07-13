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


function getLocation(uid,cb){
	var query=locationModel.find({uid:uid});
	
	query.exec(cb)
}
function getLocationById(id,cb){
	locationModel.findById(id,cb);

}
module.exports.initModel = initModel;
module.exports.addLocation=addLocation;
module.exports.getLocation=getLocation;
module.exports.getLocationById=getLocationById;