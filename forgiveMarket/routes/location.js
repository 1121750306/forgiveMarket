var express = require('express');
var router = express.Router();
var locations = require("../models/location")

//注册models监听并传递models
function callback(models) {
	locations.initModel(models);
}
/**
 * 获取uuid32 id
 */
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
router.get('/', function(req, res, next) {
	//测试用法TODO
//req.session.user={"_id":"10003","uname":"13614004325","psw":"424123","phone":"13614004325","balance":0,"avatar":"/img/innisfreeIcon/avatar.png"};
  res.render('locationManagers', { title: 'Express' });
});
router.get('/addinit', function(req, res, next) {
  res.render('addLocation', { title: 'Express' });
});
/* GET users listing. */
router.post('/add', function(req, res, next) {
	console.log("/location/add");
    var province=req.body.province;
    var city=req.body.city;
    var district=req.body.district;
    var address=req.body.address;
    var phone=req.body.phone;
    var shname=req.body.shname;
    var postcode=req.body.postcode;
    console.log("province"+province+"="+city+"="+district+"="+address+"="+phone+"="+shname+"="+postcode);  
    //uid 从session中获取
    var uid=req.session.user[0]._id;
    console.log(uid);
    var obj={uid:uid,province:province,city:city,district:district,address:address,phone:phone,shname:shname,postcode:postcode,flag:0};
    locations.addLocation(obj,function(err,docs){
    	if(!err){
    		console.log("location added");
			console.log(docs);
			locations.getLocation(uid,function(err1,data){
				if(data.length=="1"){
					locations.updateFlag2(data[0]._id,function(err2,doc){
						if(!err2){
							console.log(doc)
						}else{
							console.log(err2);
						}
					})
				}
			})
    	}else{
    		console.log(err.message);
    	}
    })
     res.render('locationManagers', {});
});
router.get('/getLocation', function(req, res, next){
	var uid=req.session.user[0]._id;
    console.log(req.session.user[0]._id);
	 locations.getLocation(uid,function(err,docs){
	 	if(!err){
    		console.log("location get"+docs.length);
    		res.send(docs);
			
    	}else{
    		console.log(err.message);
    	}
	 })
});

//获得默认收货地址
router.get('/getDefaultLocation', function(req, res, next){
	var uid=req.session.user[0]._id;
    console.log(uid);
	 locations.getDefaultLocation(uid,function(err,docs){
	 	if(!err){
    		console.log("location get"+docs.length);
    		res.send(docs);
			
    	}else{
    		console.log(err.message);
    	}
	 })
})

router.get('/updateinit/:id', function(req, res, next){
	  var id=req.params.id;
      res.send(id);
});
router.get('/updateWait/:id', function(req, res, next){
	  var id=req.params.id;
	  locations.getLocationById(id,function(err,doc){
	  	console.log(doc);
	    res.render("updateLocation",{locationItem:doc});
	  });  
});
router.post('/update',function(req,res,next){
	var flag=req.body.flag;
	var _id=req.body._id;
	var uid=req.body.uid;
	var province=req.body.province;
    var city=req.body.city;
    var district=req.body.district;
    var address=req.body.address;
    var phone=req.body.phone;
    var shname=req.body.shname;
    var postcode=req.body.postcode;
	var obj={id:_id,uid:uid,flag:flag,province:province,city:city,district:district,address:address,phone:phone,shname:shname,postcode:postcode};
	locations.updateLocation(obj,function(err){
		console.log(err);
	});
	locations.getLocationById(_id,function(e,data){
		console.log(flag+"==="+data.flag);
		if(data.flag!=flag&&flag!=undefined){
			console.log("flag!!!!");
			locations.getLocation(uid,function(err,docs){
				if(!err){
					for (var i = 0; i < docs.length; i++) {			
						 if(docs[i]._id!=_id){
						 	locations.updateFlag(docs[i]._id,function(errs){
						 		console.log(errs);
						 	})
						 }
					}
				}else{
						console.log(err);
				}	
			})		
		}
	})
	
	res.render("locationManagers");
});
router.get('/delete/:id',function(req,res,next){	
	var id=req.params.id;
	console.log("sss"+id);
	locations.deleteLocation(id,function(){
		res.render("locationManagers");
	});
})
module.exports = router;
module.exports.callback = callback;