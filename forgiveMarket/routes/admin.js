var express = require('express');
var router = express.Router();
var user = require("../models/user")

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

module.exports = router;
module.exports.callback = callback;