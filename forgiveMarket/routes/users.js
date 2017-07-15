var express = require('express');
var router = express.Router();
var user = require("../models/user")
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
//注册models监听并传递models
function callback(models) {
	user.initModel(models);
}

/**
 *注册 
 */
router.post('/register', function(req, res, next) {
	var phone = req.body.phone;
	var password = req.body.password;
	var code = req.body.code;
	console.log("phone:" + phone + ",password:" + password + ",code:" + code);
	user.register(phone, password, function(flag, err, result) {
		var json;
		if(flag == 0) {
			json = {
				flag: 300,
				msg: err
			};
		} else if(flag == 1) {
			json = {
				flag: 300,
				msg: "已存在该用户"
			};
		} else if(flag == 2) {
			req.session.user = result;
			json = {
				flag: 200,
				msg: "注册成功",
				result: result
			};
		}
		res.send(json);
	});

});
/**
 * 登录 
 */
router.post('/login', function(req, res, next) {
	var phone = req.body.phone;
	var password = req.body.password;
	console.log("phone:" + phone + ",password:" + password);
	user.login(phone, password, function(flag, err, result) {
		var json;
		if(flag == 0 || flag == 1) {
			json = {
				flag: 300,
				msg: err
			};
		} else if(flag == 2) {
			req.session.user = result;
			json = {
				flag: 200,
				msg: "登录成功",
				result: result
			};
		}
		res.send(json);
	})

});

/**
 *登出 
 */
router.post("/logout", function(req, res, next) {
	console.log(req.session.user);
	req.session.user = null;
	res.send({
		flag: 200
	});
});

router.post("/changeavatar", function(req, res, next) {
	var form = new multiparty.Form({
		uploadDir: './public/img/upload'
	});
	form.parse(req, function(err, fields, files) {
		console.log("fields:" + fields)
		console.log('err:' + err);
		console.log('files:' + files);
		var uname = fields.uname[0];
		var inputFile = files.photo[0];
		var uploadedPath = inputFile.path;
		console.log("uname:" + uname)
		console.log('inputFile:' + inputFile);
		console.log('uploadedPath:' + uploadedPath);
		res.send("9");
	});
})

module.exports = router;
module.exports.callback = callback;