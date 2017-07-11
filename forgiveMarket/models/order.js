/**
 * Created by czr_8 on 2017/7/11.
 */
orderSchema = new mongoose.Schema({
    _id:Number,
    ordernum:String,
    //0.未付款 1.购物车 2.已付款 3.已发货 4.已收货(待评价) 5.已完成
    flag:Number
})