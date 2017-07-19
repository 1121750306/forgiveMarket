var express = require('express');
var router = express.Router();
var user = require("../models/user");
var mongoose = require("mongoose");
var goodphoto = require("../models/goodphoto");
var multiparty = require('multiparty');
var fs=require('fs');
//注册models监听并传递models
function callback(models) {
	user.initModel(models);
}
router.get('/', function(req, res, next) {
	res.render("pc/login",{flag:"success"});
});

router.post('/login', function(req, res, next) {
	var username=req.body.username;
	var passwords=req.body.passwords;
	if(username=='admin'&&passwords=='admin'){
		res.render('pc/main');
	}else{
		res.render('pc/login',{flag:"fail"});
	}
});


router.post("/upload",function(req,res,next){
	console.log("进来了");
	var form = new multiparty.Form({
		uploadDir: './public/img/upload'
	});
	form.parse(req,function(err, fields, files){
		var goodid=String(fields.goodid);
		console.log("goodid"+goodid);
		var inputFile = files.photo != undefined ? files.photo[0] : null;
		var uploadedPath = inputFile != null ? inputFile.path : null;
		var types=uploadedPath.split(".")[1];
		var flag;
		if(types.toLowerCase()=="jpg"){
			flag=1;
		}else{
			flag=0;
		}
		console.log('inputFile:' + inputFile);
		console.log('uploadedPath:' + uploadedPath);
		if(uploadedPath != null) {
			uploadedPath = uploadedPath.substr(uploadedPath.indexOf("\\"), uploadedPath.length);
		};
		fs.rename(files.photo[0].path,'./public/img/upload/'+files.photo[0].originalFilename,function(err){
			if(!err){
				console.log(files.photo[0].originalFilename);
				var urls=files.photo[0].originalFilename;
				
				var obj={gid:mongoose.Types.ObjectId(goodid),url:urls,flag:flag};
				goodphoto.checkPhoto(goodid,urls,function(errs,result){
					if(!errs){
						if(result.length==0){
						goodphoto.addphoto(obj,function(err,doc){
								if(!err){
									console.log(doc);
								}else{
									consoel.log(err);
								}
							});
						}
					}else{
						console.log(err);
					}
				})
				
				
			}else{
				res.send({msg:"fail"});
				console.log(err);
			}
		});
	    
		res.send({msg:"success"});
	});
	
})
module.exports = router;
module.exports.callback = callback;