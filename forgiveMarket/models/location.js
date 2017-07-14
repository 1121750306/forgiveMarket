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
	query.sort({flag:'desc'});
	query.exec(cb);
}
function getLocationById(id,cb){
	locationModel.findById(id,cb);

}
function updateFlag(id,cb){
	locationModel.findById(id,function(err,doc){
		if(!err){
			doc.flag=0;
			doc.save();
		}else{
			cb(err);
		}
	})
}
function updateLocation(obj,cb){
	locationModel.findById(obj.id,function(err,doc){
		if(!err){
			doc.flag=obj.flag;
			doc.uid=obj.uid;
			doc.province=obj.province;
			doc.city=obj.city;
			doc.district=obj.district;
			doc.shname=obj.shname;
			doc.phone=obj.phone;
			doc.address=obj.address;
			doc.postcode=obj.postcode;
			doc.save();
		}
		else{
			cb(err);
		}		
	})
}
function deleteLocation(id,cb){
	locationModel.findById(id,function(err,doc){
		doc.remove(cb);
	});
}
module.exports.initModel = initModel;
module.exports.addLocation=addLocation;
module.exports.getLocation=getLocation;
module.exports.getLocationById=getLocationById;
module.exports.updateLocation=updateLocation;
module.exports.updateFlag=updateFlag;
module.exports.deleteLocation=deleteLocation;