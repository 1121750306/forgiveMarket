/**
 * Created by czr_8 on 2017/7/11.
 */
goodSchema = new mongoose.Schema({
    _id:Number,
    //商品类型外键
    typeid:Number,
    gname:String,
    pricebase:Number,
    discount:Number,
    sales:Number,
    lefts:Number
})