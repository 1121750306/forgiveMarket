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
//	var gid=String(req.body.gid);
	//模拟
	var gid="59700afda186ec08c06bc71c";
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

router.post('/addComToComment',function(req,res,next){
	req.session.user=[{_id:"596f4d3d3709ec1c447f01eb",uname:"13614004325",psw:"424123",phone:"13614004325",balance:0,avatar:"/img/innisfreeIcon/avatar.png"}];
//	var cid=String(req.body.cid);
	var cid = "5971584e0a43d30714050a8d";
	//模拟
	var uid=req.session.user[0]._id;
	var content=req.body.content;
	var date=new Date();
	var obj={cid:mongoose.Types.ObjectId(cid),uid:mongoose.Types.ObjectId(uid),content:content,date:date.getTime()};
	comment.addComment(obj,function(err,doc){
		if(!err){
			console.log(doc);
			res.send({msg:"success",data:doc});
		}else{
			console.log(err);
			res.send({msg:"fail",data:doc});
		}
	})
	/*var date = new Date(Number(result[i].date));
	console.log("date:" + date);
	var dateStr = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";*/
})

router.get('/getgoodComment',function(req,res,next){
//	var gid = req.params.gid;
	var gid = '59700afda186ec08c06bc71c';
	comment.getCommentByGid(gid,function(err,docs){
		if(!err){
			console.log(docs);
//			if(docs.length == 1){
//				console.log('不是数组，转为数组');
//				docs = [docs[0]];
//			}else{
//				console.log(docs.length)
//			}
//			console.log(docs)
			comment.getCommentByCids(docs,function(err1,docs1){
				if(!err1){
					res.send(docs1)
				}else{
					console.log(err1)
					res.send({msg:'wronggggg'})
				}
			})
		}else{
			console.log('该商品ID查找错误')
			res.send({msg:'wronggggg'})
		}
		
	})
})
module.exports = router;
module.exports.callback = callback;