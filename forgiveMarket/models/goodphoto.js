a/**
 * Created by czr_8 on 2017/7/11.
 */
goodphotoSchema = new mongoose.Schema({
    _id:Number,
    //商品外键
    gid:Number,
    //0.商品图片 1.商品详情图片
    flag:Number,
    url:String
})