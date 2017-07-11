/**
 * Created by czr_8 on 2017/7/11.
 */
orderitemSchema = new mongoose.Schema({
    _id:Number,
    //订单外键
    oid:Number,
    //商品外键
    gid:Number,
    num:Number
})