/**
 * Created by czr_8 on 2017/7/11.
 */
historySchema = new mongoose.Schema({
    _id:Number,
    //用户外键
    uid:Number,
    //商品外键
    gid:Number
})