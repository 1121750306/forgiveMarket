/**
 * Created by czr_8 on 2017/7/11.
 */
commentSchema = new mongoose.Schema({
    _id:Number,
    //用户外键
    uid:Number,
    //订单外键
    oid:Number,
    //商品外键
    gid:Number,
    //评论外键
    cid:Number,
    content:String,
    date:Date
})