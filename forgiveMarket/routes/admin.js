var express = require('express');
var router = express.Router();
var user = require("../models/user");
var orderitem = require("../models/orderitem");
var order= require("../models/order");
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
							  //商品详情图片
							 if(flag==1){
							 
							 	goodphoto.deletePhoto(goodid,1,function(_err,_doc){
							 		if(!_err){
							 			console.log("删除图片"+_doc);
								 		var nObj={gid:mongoose.Types.ObjectId(goodid),url:urls,flag:1};
								 		goodphoto.addphoto(nObj,function(err2,doc2){
								 			if(!err2){
								 				console.log(doc2);
								 			}else{
								 				console.log(err2);
								 			}
								 		});							 			
							 		}else{
							 			console.log(_err);
							 		}

							 	});
							 }else{
							 	//商品轮播图片
							 	goodphoto.checkDefault(goodid,function(err4,doc4){
							 		if(!err4){
							 			console.log("doc4==="+doc4.length);
							 			if(doc4.length==0||doc4.length==undefined){
										 	var nObj={gid:mongoose.Types.ObjectId(goodid),url:urls,flag:0};
										 	goodphoto.getShowPhoto(goodid,function(_err,_doc){
										 		var len=_doc.length;
										 		if(len<=4){
										 			goodphoto.addphoto(nObj,function(err2,doc2){
											 			if(!err2){
											 				console.log(doc2);
											 			}else{
											 				console.log(err2);
											 			}
											 		});
										 		}
										 	});							 			   
							 		    }else{
							 		    	goodphoto.deletePhoto(goodid,0,function(_err,_doc){
									 		if(!_err){
									 			console.log("删除图片"+_doc);
										 		var nObj={gid:mongoose.Types.ObjectId(goodid),url:urls,flag:0};
										 		goodphoto.addphoto(nObj,function(err2,doc2){
										 			if(!err2){
										 				console.log(doc2);
										 			}else{
										 				console.log(err2);
										 			}
										 		});							 			
									 		}else{
									 			console.log(_err);
									 		}
									 	 });
							 		    }
							 		}else{
							 			console.log(err4);
							 		}
							 		
							 	})

							 }
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
	
});

router.get('/orderListInit',function(req,res,next){
	res.render('pc/orderlistInit');
});
router.post('/queryOrderList',function(req,res,next){
	   var page=req.body.page;
	   var rows=req.body.rows;
	   orderitem.getAllOrderItem(function(err,doc){
		if(!err){		
			 
			 orderitem.getAllOrderItemByRow(page,rows,function(errs,docs){
			 	 if(!errs){
			 	 	  res.send({rows:docs,total:doc.length});
			 	 }else{
			 	 	console.log(errs);
			 	 }
			 })
			
			
		}else{
			console.log(err);
		}
	})
});
/*router.get*/
router.all('/updateOrderInit',function(req,res,next){
	res.render("pc/updateOrderInit");
});
router.post('/updateOrder',function(req,res,next){
	var oid=req.body.oid;
	console.log(oid);
	order.updateOrder(oid,3,function(err,doc){
		if(!err){
			console.log(doc);
			res.render('pc/orderlistInit');
		}else{
			res.render('pc/orderlistInit');
		}
	})
	
});

router.get('/getAllOrders',function(req,res,next){
	order.getAllOrders(function(err,doc){
		if(!err){
			console.log(doc);
			res.send(doc);
		}else{
			console.log(err);
		}
	})
});
router.post('/getjson',function(req,res,next){
	var a=[{
    "id":0,
    "text":"购物车"
},{
    "id":1,
    "text":"未付款"
},{
    "id":2,
    "text":"已付款",
    "selected":true
},{
    "id":3,
    "text":"已发货"
},{
    "id":4,
    "text":"已收货"
},{
    "id":5,
    "text":"已完成"
}];
  res.send(a);
});
module.exports = router;
module.exports.callback = callback;