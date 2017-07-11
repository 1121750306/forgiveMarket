var mongoose = require("mongoose");

var db = mongoose.createConnection("localhost","forgiveMarketDb")

db.on("error",function(){console.log("error")});
db.once("open",function(){
	console.log("connected");
	//1.schema
	
	userSchema = new mongoose.Schema({
		_id:Number,
		uname:String,
		psw:String
	})
//	userSchema.methods.findByName = function(cb){
//		console.log(this)
//		return this.model("User2").find({uname:this.uname},cb);
//	}
	
	
	userModel = db.model("User2",userSchema);
//	console.log(userModel)
//	
	var userEntity = new userModel({
		_id:5,
		uname:"ss",
		psw:"ww"
	});
	
	//保存到数据库
	userEntity.save();
//	addUser();
//  queryUser();
//	findByName()
//	findByNameModel()
	
//	getUser(33,33)
})