var express = require('express');
var router = express.Router();
var user = require("../models/user");
var multiparty = require('multiparty');

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
		console.log('files:' + files);
		
	})
})
module.exports = router;
module.exports.callback = callback;