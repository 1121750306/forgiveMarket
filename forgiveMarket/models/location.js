/**
 * Created by czr_8 on 2017/7/11.
 */
locationSchema = new mongoose.Schema({
    _id:Number,
    //用户外键
    uid:Number,
    //省
    province:String,
    //市
    city:String,
    //区、县
    district:String,
    address:String,
    postcode:Number,
    phone:String,
    //0.非默认 1.默认
    flag:Number
})