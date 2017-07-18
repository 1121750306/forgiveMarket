//注册models监听
function initModel(models) {
	//收货地址模型
    locationModel =  models.location;
}

/**
 * 
 * @param {Object} obj  保存对象
 * @param {Object} cb   回调函数
 */
function addLocation(obj,cb) {
	var locationEntity = new locationModel(obj);

	//保存
	locationEntity.save(cb);
}

/**
 *   获取该用户的收获地址
 * @param {Object} uid 用户id
 * @param {Object} cb  回调函数
 */
function getLocation(uid,cb){
	var query=locationModel.find({uid:uid});
	query.sort({flag:'desc'});
	query.exec(cb);
}

/**
 * 获取该用户的默认收货地址
 * @param {Object} uid
 * @param {Object} cb
 */
function getDefaultLocation(uid,cb){
	var query=locationModel.find({uid:uid,flag:1});
	query.exec(cb);
}

/**
 *   查询某条收获地址
 * @param {Object} id 收货地址id
 * @param {Object} cb  回调函数
 */
function getLocationById(id,cb){
	locationModel.findById(id,cb);

}
/**
 * 
 *  修改某条记录的flag值
 * @param {Object} id 收货地址记录id
 * @param {Object} cb  回掉函数
 */
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

function updateFlag2(id,cb){
	locationModel.findById(id,function(err,doc){
		if(!err){
			doc.flag=1;
			doc.save();
		}else{
			cb(err);
		}
	})
}
/**
 * 
 * 跟新收货地址
 * @param {Object} obj 收货地址记录对 象
 * @param {Object} cb 回调函数
 */
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
/**
 * 
 * 删除该记录
 * @param {Object} id 收货地址id
 * @param {Object} cb  回掉函数
 */
function deleteLocation(id,cb){
	locationModel.findById(id,function(err,doc){
		doc.remove(cb);
	});
}
module.exports.initModel = initModel;
module.exports.addLocation=addLocation;
module.exports.getLocation=getLocation;
module.exports.getDefaultLocation=getDefaultLocation;
module.exports.getLocationById=getLocationById;
module.exports.updateLocation=updateLocation;
module.exports.updateFlag=updateFlag;
module.exports.updateFlag2=updateFlag2;
module.exports.deleteLocation=deleteLocation;