var express = require('express');
var router = express.Router();
var good = require("../models/good");
var goodtype = require("../models/goodtype");
var goodInfo = require("../models/goodInfo");
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
	var container="";
	var smile="";
	var type;
	var gname=req.body.gname;
	var pricebase=req.body.pricebase;
	var discount=req.body.discount;
	var typeid=req.body.typeid;
	/*var container=req.body.container;*/
	var gstname=req.body.gstname;
	var fitSkin=req.body.fitSkin;
	var usage=req.body.usage;
	var fitwhere=req.body.fitwhere;
	var gname=req.body.gname;
	var packing=req.body.packing;
	var tip=req.body.tip;
	var basis=req.body.basis;
	var gsname=req.body.gsname;
	var lefts=req.body.lefts;
	//气味
	if(gstname=="气味"){
		smile=gsname;
		type=0;
	}else{
		container=gsname;
		type=1;
	}
	var priceoffset=req.body.priceoffset;
	var goodId;
	var goodObj={_id:guid(),gname:gname,typeid:typeid,discount:discount,pricebase:pricebase};
	good.addGood(goodObj,function(err,doc){
		if(!err){
			console.log(doc);
			goodId=doc._id;
			var goodinfoObj={_id:guid(),gid:goodId,container:container,smile:smile,fitSkin:fitSkin,usage:usage,fitwhere:fitwhere,packing:packing,tip:tip,basis:basis};
			goodInfo.addGoodInfo(goodinfoObj,function(err2,doc2){
				if(!err2){
					console.log(doc2);
				}else{
					console.log(err2);
				}
			});
			
			var goodsizeObj={_id:guid(),gsname:gsname,gid:goodId,priceoffset:priceoffset,lefts:lefts,sales:0,type:type};
			goodsize.addGoodSize(goodsizeObj,function(err3,doc3){
				if(!err3){
					console.log(doc3);
				}else{
					console.log(err3);
				}
			})		
			
		}else{
			console.log(err);
		}
	});
	res.render("pc/goodlistInit");
	
	
})
/**
 * 添加商品   模拟数据
 */
router.get("/addGood",function(req,res,next){
	 var obj={_id:1,gname:"男士霸王沐浴露",pricebase:100,typeid:"1",discount:0.8};
	 good.addGood(obj,function(err,doc){
	 	if(!err){
	 		console.log("添加 成功");
	 		console.log(doc);
	 	}else{
	 		console.log(err);
	 	}
	 })
})
/**
 * 添加商品详细信息  模拟数据
 */
router.get("/addGoodInfo",function(req,res,next){
	 var obj={_id:guid(),gid:"1",container:"100ml",fitSkin:"洁面与卸妆",usage:"洁面",fitwhere:"脸部",packing:"9盒装",tip:"洗澡后使用",basis:
                    "甘油、水、硬脂酸、肉豆蔻酸、聚乙二醇-32、氢氧化钾、高岭土、月桂酸、丁二醇、甘油硬脂酸酯、茶叶提取物、胭脂仙人掌果提取物、温州蜜柑果皮提取物、山茶叶提取物、兰科植物提取物、海藻糖、乙基己基甘油、PEG-100"+
                   "硬脂酸酯、椰油酰胺丙基甜菜碱、EDTA 二钠、氯化钠、苯氧乙醇、苯甲酸钠、香精"};
      goodInfo.addGoodInfo(obj,function(err,doc){
      	if(!err){
      		console.log(doc);console.log("添加成功");
      	}else{
      		console.log(err);
      	}
      })
})
/**
 * 添加商品规格类型  模拟数据
 */
router.get("/addGoodSizeType",function(req,res,next){
	 var obj={_id:guid(),gstname:"气味"};
	 goodsizetype.addGoodSizeType(obj,function(err,doc){
	 	if(!err){
      		console.log(doc);console.log("添加成功");
      	}else{
      		console.log(err);
      	}
	 })
})

/**
 * 添加商品规格 模拟数据
 */
router.get("/addGoodSize",function(req,res,next){
	 var obj={_id:guid(),gsname:"原味",gstid:"8d43787e-8e3d-4044-9629-a124809fbd62",priceoffset:30,lefts:90,sales:12};
	 goodsize.addGoodSize(obj,function(err,doc){
	 	if(!err){
      		console.log(doc);console.log("添加成功");
      	}else{
      		console.log(err);
      	}
	 })
	 
})
/**
 * 查询商品列表
 */
router.post("/queryGoodList",function(req,res,next){
	 good.queryGoodList(function(err,docs){
	 	console.log(docs.length);
	 	if(!err){
	 		res.send(docs);
	 	}else{
	 		console.log(err);
	 	}
	 })
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
module.exports = router;
module.exports.callback = callback;