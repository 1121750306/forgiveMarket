var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var comment = require("../models/comment")

//注册models监听并传递models
function callback(models) {
	comment.initModel(models);
}

router.post('/addComment',function(req,res,next){
	req.session.user=[{_id:"596f4d3d3709ec1c447f01eb",uname:"13614004325",psw:"424123",phone:"13614004325",balance:0,avatar:"/img/innisfreeIcon/avatar.png"}];
	/*var gid=String(req.body.gid);*/
	//模拟
	var gid="596f4d3d3709ec1c447f01eb";
	var uid=req.session.user[0]._id;
	var content=req.body.content;
	var date=new Date();
	var obj={gid:mongoose.Types.ObjectId(gid),uid:mongoose.Types.ObjectId(uid),content:content,date:date.getTime()};
	comment.addComment(obj,function(err,doc){
		if(!err){
			console.log(doc);
			res.send({msg:"success"});
		}else{
			console.log(err);
			res.send({msg:"fail"});
		}
	})
	/*var date = new Date(Number(result[i].date));
	console.log("date:" + date);
	var dateStr = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";*/
})
module.exports = router;
module.exports.callback = callback;