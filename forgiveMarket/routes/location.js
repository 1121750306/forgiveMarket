var express = require('express');
var router = express.Router();
var locations = require("../models/location")

//注册models监听并传递models
function callback(models) {
	locations.initModel(models);
}
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
router.get('/', function(req, res, next) {
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
    var obj={_id:guid(),uid:'10001',province:province,city:city,district:district,address:address,phone:phone,shname:shname,postcode:postcode,flag:0};
    locations.addLocation(obj,function(err,docs){
    	if(!err){
    		console.log("location added");
			console.log(docs);
    	}else{
    		console.log(err.message);
    	}
    })
     res.render('locationManagers', {});
});
router.get('/getLocation', function(req, res, next){
	 locations.getLocation('10001',function(err,docs){
	 	if(!err){
    		console.log("location get");
			console.log(docs);
			res.send(docs);
    	}else{
    		console.log(err.message);
    	}
	 })
})

router.get('/updateinit/:id', function(req, res, next){
	  var id=req.params.id;
	  locations.getLocationById(id,function(err,doc){
	  	console.log(doc);
	  	
	  })
	  res.render('updateLocation',{});
})
module.exports = router;
module.exports.callback = callback;