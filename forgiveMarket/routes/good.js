var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var good = require("../models/good");
var goodtype = require("../models/goodtype");
var goodInfo = require("../models/goodInfo");
var goodphoto=require("../models/goodphoto");
var goodsizetype = require("../models/goodsizetype");
var goodsize= require("../models/goodsize");
//注册models监听并传递models
function callback(models) {
	good.initModel(models);
}
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
router.get("/goodlistInit",function(req,res,next){
	res.render("pc/goodlistInit")
});

router.get("/addInit",function(req,res,next){
	 res.render("pc/addInit");
})

router.post("/Add",function(req,res,next){	
	/*************************************************************************************/
	//添加商品表
	var gname=req.body.gname;
	var pricebase=req.body.pricebase;
	var typeid=req.body.typeid;
	var discount=req.body.discount;
	var goodid;
	
		//添加商品信息表
	var fitSkin=req.body.fitSkin;
	var usage=req.body.usage;
	var fitwhere=req.body.fitwhere;
	var packing=req.body.packing;
	var tip=req.body.tip; 
	var basis=req.body.basis;
	var realContainer="",realSmile="";
	var container=req.body.container;
	var  smile=req.body.smile;
		//添加商品规格
	var goodsizeObjs1=[],goodsizeObjs2=[];
	var lefts1=req.body.lefts1;
	var lefts2=req.body.lefts2;
	var priceoffset1=req.body.priceoffset1;
	var priceoffset2=req.body.priceoffset2;
	console.log(typeid);
	var goodObj={gname:gname,pricebase:pricebase,typeid:mongoose.Types.ObjectId(typeid),discount:discount};
	
	good.addGood(goodObj,function(err,doc){
		if(!err){
			goodid=doc._id;
			
			var goodphotoObj={gid:mongoose.Types.ObjectId(goodid),url:"default.png",flag:0};
			goodphoto.addphoto(goodphotoObj,function(_err,_doc){
				if(!_err){
					console.log(_doc);
				}else{
					console.log(_err);
				}
			});
			var goodphotoObj2={gid:mongoose.Types.ObjectId(goodid),url:"default.jpg",flag:1};
			goodphoto.addphoto(goodphotoObj2,function(_err1,_doc1){
				if(!_err1){
					console.log(_doc1);
				}else{
					console.log(_err1);
				}
			});
			
			if(typeof(container)=="string"){
				realContainer=container;
			}else if(typeof(container)=="object"){
				realContainer=JSON.stringify(container);
			}
			
			console.log("smile"+typeof(smile));
			if(typeof(smile)=="string"){
				realSmile=smile;
			}else if(typeof(smile)=="object"){
				realSmile=JSON.stringify(smile);
			}
			console.log(realSmile);
			var goodInfoObj={gid:mongoose.Types.ObjectId(goodid),fitSkin:fitSkin,usage:usage,fitwhere:fitwhere,packing:packing,tip:tip,basis:basis,container:realContainer,smile:realSmile};
			goodInfo.addGoodInfo(goodInfoObj,function(err2,doc2){
				if(!err2){
					console.log(doc2);
				}else{
					console.log(err2);
				}
			})
			/*************************************************************************************/
		    if(container.length!=0){
				if(typeof(container)=="string"){
					realContainer=container;
					var goodsizeObj={gid:mongoose.Types.ObjectId(goodid),type:1,gsname:realContainer,priceoffset:priceoffset1,lefts:lefts1,sales:0};
					goodsize.addGoodSize(goodsizeObj,function(err3,doc3){
						if(!err3){
							console.log(doc3);
						}else{
							console.log(err3);
						}
					})
				}else if(typeof(container)=="object"){
					realContainer=JSON.stringify(container);
					console.log("len"+container.length);
					for(var i=0;i<container.length;i++){
						var gsObj={gid:mongoose.Types.ObjectId(goodid),type:1,gsname:container[i],priceoffset:priceoffset1[i],lefts:lefts1[i],sales:0};
						goodsizeObjs1.push(gsObj);
					}
					goodsize.addGoodSizes(goodsizeObjs1,function(err4,doc4){
						if(!err4){
							console.log(doc4);
						}else{
							console.log(err4);
						}
					})
				}		    	
		   }
			if(smile.length!=0){
				console.log("smilebuweikong"+smile);
		         if(typeof(smile)=="string"){
						realSmile=smile;
						var goodsizeObj={gid:mongoose.Types.ObjectId(goodid),type:0,gsname:realSmile,priceoffset:priceoffset2,lefts:lefts2,sales:0};
						goodsize.addGoodSize(goodsizeObj,function(err5,doc5){
							if(!err5){
								console.log(doc5);
							}else{
								console.log(err5);
							}
						})
					}else if(typeof(smile)=="object"){
						realContainer=JSON.stringify(container);
						console.log("len"+smile.length);
						for(var i=0;i<smile.length;i++){
							var gsObj={gid:mongoose.Types.ObjectId(goodid),type:0,gsname:smile[i],priceoffset:priceoffset2[i],lefts:lefts2[i],sales:0};
							goodsizeObjs2.push(gsObj);
						}
						goodsize.addGoodSizes(goodsizeObjs2,function(err6,doc6){
							if(!err6){
								console.log(doc6);
							}else{
								console.log(err6);
							}
						})
					}				
			}
		   
					
		}else{
			console.log(err);
		}
		res.render("pc/goodlistInit");
	});
	
	/*************************************************************************************/


	
	
})



//删除商品
 router.all("/deleteGood",function(req,res,next){
 	 var id=req.body.id||req.query.id;
 	 console.log(id);
	 if(typeof(id)=='string'){
	 	good.deleteGood(id,function(err,doc){
	 		if(!err){
	 			console.log("该商品删除成功");
	 		}else{
	 			console.log(err);
	 		}
	 	});
	 	goodsize.deleteGoodSize(id,function(err,doc){
	 		if(!err){
	 			console.log("该商品规格删除成功");
	 		}else{
	 			console.log(err);
	 		}
	 	});
	 	goodInfo.deleteGoodInfo(id,function(err,doc){
	 		if(!err){
	 			console.log("商品详情删除成功");
	 		}else{
	 			console.log(err);
	 		}
	 	});
	 	
	 }
	 else{
	 	for (var i=0;i<id.length;i++) {
	    	console.log(id[i]);
	 	    good.deleteGood(id[i]); 	    
	 	    goodsize.deleteGoodSize(id[i],function(err,doc){
	 		if(!err){
	 			console.log(doc);
	 		}else{
	 			console.log(err);
	 		}
		 	});
		 	goodInfo.deleteGoodInfo(id[i],function(err,doc){
		 		if(!err){
		 			console.log(doc);
		 		}else{
		 			console.log(err);
		 		}
		 	});
	   }
	 
	 }
	 res.render("pc/goodlistInit");
 })
 
 /**
  * 跟新商品初始化
  */

router.get('/updateInit/:id',function(req,res,next){
	var goodid=req.params.id;
	console.log("goodid"+goodid);
    res.render("pc/updategood",{goodid:goodid});
});

router.post('/Update',function(req,res,next){
	var goodid=String(req.body.goodid);
	
	var gname=req.body.gname;
	var pricebase=req.body.pricebase;
	/*var typeid=req.body.typeid;*/
	var discount=req.body.discount;
	var goodid;
	
	var fitSkin=req.body.fitSkin;
	var usage=req.body.usage;
	var fitwhere=req.body.fitwhere;
	var packing=req.body.packing;
	var tip=req.body.tip; 
	var basis=req.body.basis;
	var realContainer="",realSmile="";
	var container=req.body.container;
	var  smile=req.body.smile;

	var goodsizeObjs1=[],goodsizeObjs2=[];
	var lefts1=req.body.lefts1;
	var lefts2=req.body.lefts2;
	var priceoffset1=req.body.priceoffset1;
	var priceoffset2=req.body.priceoffset2;
	
	if(smile==undefined){
		smile="";
	}
	if(container==undefined){
		container="";
	}
	var goodObj={_id:goodid,gname:gname,pricebase:pricebase,discount:discount};
	good.updateGood(goodObj,function(err,doc){
		if(!err){
			console.log(doc);
			console.log("商品修改成功");
		}else{
			console.log(err);
		}
	});
	
	var goodinfoObj={gid:mongoose.Types.ObjectId(goodid),packing:packing,tip:tip,fitwhere:fitwhere,basis:basis};
	goodInfo.updateGoodInfo(goodinfoObj,function(err,doc){
		if(!err){
			console.log(doc);
			console.log("商品信息修改成功");
		}else{
			console.log(err);
		}
	});
	
	//该商品有气味规格
	if(smile.length!=0){
		console.log("smile.length"+smile.length);
		 //只有一条容量规格
		 if(typeof(smile)=="string"){
		 	var goodsizeObj={gid:mongoose.Types.ObjectId(goodid),gsname:smile,priceoffset:priceoffset2,lefts:lefts2};
		 	  var objs2=[];
			 objs2.push(goodsizeObj);
		 	 goodsize.UpdateGoodSizes(objs2,function(err,doc){
		 		if(!err){
		 			console.log(doc);
					console.log("商品规格修改成功");
		 		}else{
		 			consoel.log(err);
		 		}
		 	});
		 }else if(typeof(smile)=="object"){
		 	for(var i=0;i<smile.length;i++){
		 		var gsObj={gid:mongoose.Types.ObjectId(goodid),gsname:smile[i],priceoffset:priceoffset2[i],lefts:lefts2[i]};
		 		goodsizeObjs2.push(gsObj);
		 	}
		 	goodsize.UpdateGoodSizes(goodsizeObjs2,function(err,doc){
		 		if(!err){
		 			console.log(doc);
					console.log("商品规格修改成功");
		 		}else{
		 			consoel.log(err);
		 		}
		 	})
		 }
	}
		
			//该商品有容量规格
	 if(container.length!=0){     
			 //只有一条容量规格
			 if(typeof(container)=="string"){
			 	  console.log("进来了LLLLIIIIIIIIII===========");
			 	  var goodsizeObj={gid:mongoose.Types.ObjectId(goodid),gsname:container,priceoffset:priceoffset1,lefts:lefts1};
			 	  var objs=[];
			 	  objs.push(goodsizeObj);
			 	goodsize.UpdateGoodSizes(objs,function(err,doc){
			 		if(!err){
			 			console.log(doc);
						console.log("商品规格修改成功");
			 		}else{
			 			consoel.log(err);
			 		}
			 	});
			 }else if(typeof(container)=="object"){
			 	
			 	for(var i=0;i<container.length;i++){
			 		console.log("进来了==========="+container[i]);
			 		var gsObj={gid:mongoose.Types.ObjectId(goodid),gsname:container[i],priceoffset:priceoffset1[i],lefts:lefts1[i]};
			 		goodsizeObjs1.push(gsObj);
			 	}
			 	goodsize.UpdateGoodSizes(goodsizeObjs1,function(err,doc){
			 		console.log("进来了=====!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
			 		if(!err){
			 			console.log(doc);
						console.log("商品规格修改成功===");
			 		}else{
			 			consoel.log(err);
			 		}
			 	});
			 }
		}
		res.render("pc/goodlistInit");
});
/**
 * 查询商品列表
 */
router.post("/queryGoodList",function(req,res,next){
	 var page=req.body.page;
	 var rows=req.body.rows;
	 console.log("page"+page+"===rows"+rows);
	 good.countGoodList(function(errs,doc){
	 	if(!errs){
	 		good.queryGoodList(page,rows,function(err,docs){
			 	console.log(docs.length);
			 	if(!err){
			 		res.send({rows:docs,total:doc.length});
			 	}else{
			 		console.log(err);
			 	}
			 });
	 	}
	 });
	 
});
/**
 * 查询商品类型
 */
router.post("/queryGoodType",function(req,res,next){
	var id=req.body.id;
	console.log(id);
	goodtype.getGoodType(id,function(err,doc){
		if(!err){
			console.log(doc);
			res.send(doc);
		}else{
			console.log(err);
		}
	})
});
//查询所有商品类型
router.get("/queryAllType",function(req,res,next){
	goodtype.getGoodTypes(function(err,docs){
		if(!err){
			console.log(docs);
			res.send(docs);
		}else{
			console.log(err);
		}
	})
})
/**
 * 根据goodid查询商品信息
 */
router.post('/queryGoodInfoByid',function(req,res,next){
	var id=req.body.id;
	goodInfo.getGoodInfoId(id,function(err,doc){
		if(!err){
			res.send(doc);
			console.log(doc);
		}else{
			console.log(err);
		}
	})
})


/**
 * 根据goodid查询商品规格
 */
router.post('/queryGoodSizeByid',function(req,res,next){
	var id=req.body.id;
	goodsize.QuerySizeByid(id,function(err,doc){
		if(!err){
			console.log(doc);
			res.send(doc);
		}else{
			console.log(err);
		}
	})
})

//查询商品规格类型
router.get("/queryAllGoodSizeType",function(req,res,next){
	goodsizetype.getGoodSizeTypes(function(err,docs){
		if(!err){
			console.log(docs);
			res.send(docs);
		}else{
			console.log(err);
		}
	})
})

/**
 * 根据id查询商品
 */
router.post('/queryGoodByid',function(req,res,next){
	var id=req.body.id;
	good.getGoodById(id,function(err,doc){
		if(!err){
			console.log(doc);
			res.send(doc);
		}else{
			console.log(err);
		}
	})
});

/**
 * 根据商品类型id查询商品
 */
router.get('/getGoodsByTypeid',function(req,res,next){
	var typeid=req.query.typeid;
	good.queryGoodsByType(typeid,function(err,doc){
		if(!err){
			res.send(doc);		
		}else{
			console.log(err);
		}
	})
});
/**
 * 根据gid获取商品的销量
 */
router.get('/getGoodSales/:gid',function(req,res,next){
	var gid=req.params.gid;
	var sales=0;
	goodsize.QuerySizeByid(gid,function(err,doc){
		if(!err){
			for(var i=0;i<doc.length;i++){
				sales=sales+Number(doc[i].sales);
			}
			 console.log(sales);
			 res.send(sales+"");
		}else{
			console.log(err);
		}
	})
})
module.exports = router;
module.exports.callback = callback;