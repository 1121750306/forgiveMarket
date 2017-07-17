var mongoose = require("mongoose");

var db = mongoose.createConnection("localhost", "forgiveMarketDb");

db.on("error", function() {
	console.log("error")
});
db.once("open", function() {
	console.log("connected");
	//定义schema
	//用户表
	userSchema = new mongoose.Schema({
		uname: String,
		psw: String,
		phone: String,
		balance: Number,
		avatar: String
	}, {
		versionKey: false
	});
	userModel = db.model("User", userSchema);

	// 商品表
	goodSchema = new mongoose.Schema({
		//商品类型外键
		typeid: String,
		gname: String,
		pricebase: Number,
		discount: Number
	}, {
		versionKey: false
	});
	goodModel = db.model("Good", goodSchema);

	// 商品类型表
	goodtypeSchema = new mongoose.Schema({
		tname: String
	}, {
		versionKey: false
	});
	goodtypeModel = db.model("Goodtype", goodtypeSchema);

	// 商品照片表
	goodphotoSchema = new mongoose.Schema({
		//商品外键
		gid: String,
		//0.商品图片 1.商品详情图片
		flag: Number,
		url: String
	}, {
		versionKey: false
	});
	goodphotoModel = db.model("Goodphoto", goodphotoSchema);

	// 商品规格类型表
	goodsizetypeSchema = new mongoose.Schema({
		gstname: String
	}, {
		versionKey: false
	});
	goodsizetypeModel = db.model("Goodsizetype", goodsizetypeSchema);

	//goodInfo
	goodInfoSchema = new mongoose.Schema({
		gid: String,
		container: String,
		smile: String,
		fitSkin: String,
		usage: String,
		fitwhere: String,
		packing: String,
		tip: String,
		basis: String
	}, {
		versionKey: false
	})
	goodInfoModel = db.model("GoodInfo", goodInfoSchema);

	// 商品规格表
	goodsizeSchema = new mongoose.Schema({
		gsname: String,
		//商品价格偏移量
		priceoffset: Number,
		//商品外键
		gid: String,
		sales: Number,
		lefts: Number,
		//0气味1容量
		type: Number
	}, {
		versionKey: false
	});
	goodsizeModel = db.model("Goodsize", goodsizeSchema);

	// 订单表
	orderSchema = new mongoose.Schema({
		//用户外键
		uid: String,
		//0.购物车 1.未付款 2.已付款 3.已发货 4.已收货(待评价)5.已完成
		flag: Number,
		//订单时间
		date: Date
	}, {
		versionKey: false
	});
	orderModel = db.model("Order", orderSchema);

	// 订单项表
	orderitemSchema = new mongoose.Schema({
		//订单外键
		oid: String,
		//商品外键
		gid: String,
		num: Number
	}, {
		versionKey: false
	});
	orderitemModel = db.model("Orderitem", orderitemSchema);

	// 收货地址表
	locationSchema = new mongoose.Schema({
		//用户外键
		uid: String,
		//省
		province: String,
		//市
		city: String,
		//区、县
		district: String,
		address: String,
		//收货人姓名
		shname: String,
		postcode: Number,
		phone: String,
		//0.非默认 1.默认
		flag: Number
	}, {
		versionKey: false
	});
	locationModel = db.model("Location", locationSchema);

	// 评论表
	commentSchema = new mongoose.Schema({
		//用户外键
		uid: String,
		//订单外键
		oid: String,
		//商品外键
		gid: String,
		//评论外键
		cid: String,
		content: String,
		date: Date
	}, {
		versionKey: false
	});
	commentModel = db.model("Comment", commentSchema);

	//点赞表
	thumbSchema = new mongoose.Schema({
		//用户外键
		uid: String,
		//评论外键
		commentid: String
	}, {
		versionKey: false
	});
	thumbModel = db.model("Thumb", thumbSchema);

	// 浏览历史表
	historySchema = new mongoose.Schema({
		//用户外键
		uid: String,
		//商品外键
		gid: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Good'
		},
		//浏览时间
		date: String
	}, {
		versionKey: false
	});
	historyModel = db.model("History", historySchema);

	// 收藏表
	collectSchema = new mongoose.Schema({
		//用户外键
		uid: String,
		//商品外键
		gid: String,
		//收藏时间
		date: Date
	}, {
		versionKey: false
	});
	collectModel = db.model("Collect", collectSchema);
	//定义model

	//models回调map
	listener({
		user: userModel,
		good: goodModel,
		goodtype: goodtypeModel,
		goodphoto: goodphotoModel,
		goodsizetype: goodsizetypeModel,
		goodsize: goodsizeModel,
		order: orderModel,
		orderitem: orderitemModel,
		location: locationModel,
		comment: commentModel,
		history: historyModel,
		collect: collectModel,
		goodInfo: goodInfoModel,
		thumb: thumbModel
	});
})

//models回调
function initModels(cb) {
	listener = cb;
}

module.exports.initModels = initModels;