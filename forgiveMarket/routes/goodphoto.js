var express = require('express');
var router = express.Router();
var goodphoto = require("../models/goodphoto")

//注册models监听并传递models
function callback(models) {
	goodphoto.initModel(models);
}
/**
 * 根据商品id获取图片
 */
router.get('/getPhotobygid',function(req,res,next){
	var gid=req.query.gid;
	console.log(gid);
	goodphoto.getPhotoByGoodid(gid,function(err,doc){
		if(!err){
	        console.log(doc.length);
		    var photos={infoImg:[],bannerImg:[]};
		    for(var i=0;i<doc.length;i++){
		    	if(doc[i].flag==1){
		    		console.log("doc[i].url"+doc[i].url);
		    		 photos.infoImg.push(doc[i].url);
		    	}else if(doc[i].flag==0){
		    		photos.bannerImg.push(doc[i].url);
		    	}
		    }
		     console.log(photos);
		     res.send(photos);
		}
		else{
			console.log(err);
		}
	})
});

router.get('/getShowPhoto',function(req,res,next){
	var gid=req.query.gid;
	goodphoto.getShowPhoto(gid,function(err,doc){
		if(!err){
			res.send(doc[0].url);
		}
		else{
			console.log(err);
		}
	})
});
module.exports = router;
module.exports.callback = callback;