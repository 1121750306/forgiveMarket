var express = require('express');
var router = express.Router();
var good = require("../models/good")
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
})

router.get("/addGood",function(req,res,next){
	 var obj={_id:1,gname:"男士霸王沐浴露",pricebase:100,typeid:"1",discount:0.8,sales:800,lefts:80};
	 good.addGood(obj,function(err,doc){
	 	if(!err){
	 		console.log("添加 成功");
	 		console.log(doc);
	 	}else{
	 		console.log(err);
	 	}
	 })
})
router.post("/queryGoodList",function(req,res,next){
	 good.queryGoodList(function(err,docs){
	 	console.log(docs.length);
	 	if(!err){
	 		res.send(docs);
	 	}else{
	 		console.log(err);
	 	}
	 })
})
module.exports = router;
module.exports.callback = callback;