var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var comment = require("../models/comment");
var multiparty = require('multiparty');
var orderitem = require("../models/orderitem");
var fs=require('fs');
//注册models监听并传递models
function callback(models) {
	comment.initModel(models);
}

router.post('/addThumb',function(req,res,next){
    // req.session.user=[{_id:"596f4d3d3709ec1c447f01eb",uname:"13614004325",psw:"424123",phone:"13614004325",balance:0,avatar:"/img/innisfreeIcon/avatar.png"}];
    var uid=req.body.uid;
    uid = mongoose.Types.ObjectId(uid);
    var cid = req.body.cid;
    //模拟
    // var gid="59700afda186ec08c06bc71c";
    // var uid=req.session.user[0]._id;
    // var content=req.body.content;
    // var otid=req.body.otid;
    // var date=new Date();
    comment.addThumbById(cid,uid,function(err,doc){
        if(!err){
            console.log(doc);
            res.send({flag:200,msg:'点赞成功'})

        }else{
            console.log(err);
            res.send({flag:300,msg:"错误"});
        }
    })
	/*var date = new Date(Number(result[i].date));
	 console.log("date:" + date);
	 var dateStr = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";*/
})
router.post('/addComment',function(req,res,next){
	
	var uid=req.session.user[0]._id;
	var form = new multiparty.Form({
		uploadDir: './public/img/upload'
	});
	form.parse(req,function(err, fields, files){
		var content=fields.content;
		var otid=fields.otid;
		var gid=fields.gid.toString();
		var date=new Date();
		var photos = [];
		if(files.photo0!=undefined){
			var path=files.photo0[0].path
			var uploadPath=path.substr(path.indexOf("\\"), path.length);
			console.log("uploadpath"+uploadPath);
			photos.push(uploadPath);
		}
		if(files.photo1!=undefined){
			var path=files.photo1[0].path;
			var uploadPath=path.substr(path.indexOf("\\"), path.length);
			console.log("uploadpath"+uploadPath);
			photos.push(uploadPath);
		}
		if(files.photo2!=undefined){
			var path=files.photo2[0].path;
			var uploadPath=path.substr(path.indexOf("\\"), path.length);
			console.log("uploadpath"+uploadPath);
			photos.push(uploadPath);
		}
		if(files.photo3!=undefined){
			var path=files.photo3[0].path;
			var uploadPath=path.substr(path.indexOf("\\"), path.length);
			console.log("uploadpath"+uploadPath);
			photos.push(uploadPath);
		}
		if(files.photo4!=undefined){
			var path=files.photo4[0].path;
			var uploadPath=path.substr(path.indexOf("\\"), path.length);
			console.log("uploadpath"+uploadPath);
			photos.push(uploadPath);
		}
		var obj={gid:mongoose.Types.ObjectId(gid),uid:mongoose.Types.ObjectId(uid),content:content,date:date.getTime(),thumb:[],photos:photos};
		comment.addComment(obj,function(err,doc){
			if(!err){
				console.log(doc);
				var orderItemObj={_id:otid,cid:mongoose.Types.ObjectId(doc._id)};
				orderitem.updateOrderItem(orderItemObj,function(errs,doc2){
					if(!errs){
						console.log(doc2);
						res.send({msg:"success"});
					}
					else{
						console.log(errs);
			         	res.send({msg:"fail"});
					}
				});
			}else{
				console.log(err);
			}
		})
	})
});

router.post('/addComToComment',function(req,res,next){
	// req.session.user=[{_id:"596f4d3d3709ec1c447f01eb",uname:"13614004325",psw:"424123",phone:"13614004325",balance:0,avatar:"/img/innisfreeIcon/avatar.png"}];
	var cid=req.body.cid;
	// var cid = "5971584e0a43d30714050a8d";
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
})

router.get('/getgoodComment:gid',function(req,res,next){
	var gid = req.params.gid;
	// var gid = '59700afda186ec08c06bc71c';
	console.log(gid)
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