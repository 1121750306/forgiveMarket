var mongoose = require("mongoose");

var db = mongoose.createConnection("localhost","forgiveMarketDb");

db.on("error",function(){console.log("error")});
db.once("open",function(){
    console.log("connected");
    //定义schema
    //用户表
    userSchema = new mongoose.Schema({
        _id:String,
        uname:String,
        psw:String,
        phone:String,
        balance:Number,
        avatar:String
    },{versionKey:false});

    // 商品表
    goodSchema = new mongoose.Schema({
        _id:String,
        //商品类型外键
        typeid:String,
        gname:String,
        pricebase:Number,
        discount:Number,
        sales:Number,
        lefts:Number
    },{versionKey:false});

    // 商品类型表
    goodtypeSchema = new mongoose.Schema({
        _id:String,
        tname:String
    },{versionKey:false});

    // 商品照片表
    goodphotoSchema = new mongoose.Schema({
        _id:String,
        //商品外键
        gid:String,
        //0.商品图片 1.商品详情图片
        flag:Number,
        url:String
    },{versionKey:false});

    // 商品规格类型表
    goodsizetypeSchema = new mongoose.Schema({
        _id:String,
        gstname:String,
        //商品外键
        gid:String
    },{versionKey:false});

    // 商品规格表
    goodsizeSchema = new mongoose.Schema({
        _id:String,
        gsname:String,
        //商品价格偏移量
        priceoffset:Number,
        //商品规格类型外键
        gstid:String
    },{versionKey:false});

    // 订单表
    orderSchema = new mongoose.Schema({
        _id:String,
        ordernum:String,
        //0.未付款 1.购物车 2.已付款 3.已发货 4.已收货(待评价) 5.已完成
        flag:Number
    },{versionKey:false});

    // 订单项表
    orderitemSchema = new mongoose.Schema({
        _id:String,
        //订单外键
        oid:String,
        //商品外键
        gid:String,
        num:Number
    },{versionKey:false});

    // 收货地址表
    locationSchema = new mongoose.Schema({
        _id:String,
        //用户外键
        uid:String,
        //省
        province:String,
        //市
        city:String,
        //区、县
        district:String,
        address:String,
        //收货人姓名
        shname:String,
        postcode:Number,
        phone:String,
        //0.非默认 1.默认
        flag:Number
    },{versionKey:false});

    // 评论表
    commentSchema = new mongoose.Schema({
        _id:String,
        //用户外键
        uid:String,
        //订单外键
        oid:String,
        //商品外键
        gid:String,
        //评论外键
        cid:String,
        content:String,
        date:Date
    },{versionKey:false});

    // 浏览历史表
    historySchema = new mongoose.Schema({
        _id:String,
        //用户外键
        uid:String,
        //商品外键
        gid:String
    },{versionKey:false});

    // 收藏表
    collectSchema = new mongoose.Schema({
        _id:String,
        //用户外键
        uid:String,
        //商品外键
        gid:String
    },{versionKey:false});
    
    //定义model
    userModel = db.model("User",userSchema);
    goodModel = db.model("Good",goodSchema);
    goodtypeModel = db.model("Goodtype",goodtypeSchema);
    goodphotoModel = db.model("Goodphoto",goodphotoSchema);
    goodsizetypeModel = db.model("Goodsizetype",goodsizetypeSchema);
    goodsizeModel = db.model("Goodsize",goodsizeSchema);
    orderModel = db.model("Order",orderSchema);
    orderitemModel = db.model("Orderitem",orderitemSchema);
    locationModel = db.model("Location",locationSchema);
    commentModel = db.model("Comment",commentSchema);
    historyModel = db.model("History",historySchema);
    collectModel = db.model("Collect",collectSchema);

	//models回调map
    listener({user:userModel,good:goodModel,goodtype:goodtypeModel,goodphoto:goodphotoModel,
    		goodsizetype:goodsizetypeModel,goodsize:goodsizeModel,order:orderModel,orderitem:orderitemModel,
    		location:locationModel,comment:commentModel,history:historyModel,collect:collectModel});
})

//models回调
function initModels(cb){
    listener = cb;
}

module.exports.initModels = initModels;
