//注册models监听
function initModel(models) {
	//商品信息模型
    goodInfoModel =  models.goodInfo;
}
/**
 * 
 * @param {Object} obj 一条=商品信息记录
 * @param {Object} cb 回调函数
 */
function addGoodInfo(obj,cb){
	var goodInfoEntity=new goodInfoModel(obj);
	 goodInfoEntity.save(cb);
}

function getTest(id, cb) {
    goodModel.find({
        _id: id
    })
        .populate({
            path: 'typeid'
        })
        .exec(function(err, docs) {
            cb(err, docs);
        })
}
function getGoodSize(id,cb){
    goodsizeModel.find({
        gid:id
    })
        .exec(function(err,docs){
            cb(err,docs)
        })
}

function getGoodInfo(id, cb) {//id为goodinfoID
    goodInfoModel.find({
        _id: id
    })
        .populate({
            path: 'gid',
            populate: {
                path: 'typeid'
            }
        })
        .exec(function(err, docs) {
            cb(err,docs)
        })
}
function getGoodInfoId(gid,cb){
    goodInfoModel.find({
        gid:gid
    })
        .exec(function(err,docs){
            cb(err,docs)
        })
}

function deleteGoodInfo(id,cb){
	goodInfoModel.find({gid:id}).remove(cb);
}
module.exports.initModel = initModel;
module.exports.addGoodInfo = addGoodInfo;
module.exports.getTest = getTest;
module.exports.getGoodInfo = getGoodInfo;
module.exports.getGoodSize = getGoodSize;
module.exports.getGoodInfoId = getGoodInfoId;
module.exports.deleteGoodInfo = deleteGoodInfo;