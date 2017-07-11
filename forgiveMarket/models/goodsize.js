/**
 * Created by czr_8 on 2017/7/11.
 */
goodsizeSchema = new mongoose.Schema({
    _id:Number,
    gsname:String,
    //商品价格偏移量
    priceoffset:Number,
    //商品规格类型外键
    gstid:Number
})