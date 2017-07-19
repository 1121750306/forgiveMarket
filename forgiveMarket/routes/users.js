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
	console.log("phone:" + phone + ",password:" + password + ",code:" + code);
	user.register(phone, password, function(flag, err, result) {
		var json;
		if(flag == 0) {
			json = {
				flag: 300,
				msg: "注册失败"
			};
		} else if(flag == 1) {
			json = {
				flag: 300,
				msg: "已存在该用户"
			};
		} else if(flag == 2) {
			console.log("注册成功", "result:" + result);
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
		if(flag == 0) {
			json = {
				flag: 300,
				msg: "登录失败"
			};
		} else if(flag == 1) {
			json = {
				flag: 300,
				msg: "密码错误"
			};
		} else if(flag == 2) {
			req.session.user = result;
			json = {
				flag: 300,
				msg: "账号不存在"
			};
		} else if(flag == 3) {
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

/**
 *	修改资料 
 */
router.post("/changeavatar", function(req, res, next) {
	if(req.session.user == null) {
		res.send({
			flag: 300,
			msg: "未登录"
		});
		return;
	}
	var form = new multiparty.Form({
		uploadDir: './public/img/upload'
	});
	form.parse(req, function(err, fields, files) {
		console.log("user:" + req.session.user[0])
		console.log("fields:" + fields)
		console.log('err:' + err);
		console.log('files:' + files);
		var uname = fields.uname != undefined && fields.uname != "" ? fields.uname[0] : null;
		var inputFile = files.photo != undefined ? files.photo[0] : null;
		var uploadedPath = inputFile != null ? inputFile.path : null;
		console.log("uname:" + uname)
		console.log('inputFile:' + inputFile);
		console.log('uploadedPath:' + uploadedPath);
		if(uploadedPath != null) {
			uploadedPath = uploadedPath.substr(uploadedPath.indexOf("\\"), uploadedPath.length);
		}
		user.changeUserInfo(req.session.user[0]._id, uname, uploadedPath, function(flag, err, result) {
			if(!err) {
				if(flag == 1) {
					res.send({
						flag: 200,
						msg: "修改成功",
						result: result
					});
				} else if(flag == 2) {
					res.send({
						flag: 300,
						msg: "不存在该用户"
					});
				} else {
					res.send({
						flag: 300,
						msg: "修改失败"
					});
				}
			} else {
				res.send({
					flag: 300,
					msg: "修改失败"
				});
			}
		})

	});
});

router.post("/changepwd", function(req, res, next) {
	if(req.session.user == null) {
		res.send({
			flag: 300,
			msg: "未登录"
		});
		return;
	}
	var _id = req.session.user[0]._id;
	var nowpwd = req.body.nowpwd;
	var password = req.body.password;
	if(nowpwd == undefined || password == undefined) {
		res.send({
			flag: 300,
			msg: "信息错误"
		});
		return;
	}
	user.changePwd(_id, nowpwd, password, function(flag, err, result) {
		if(flag == 1) {
			res.send({
				flag: 200,
				msg: "修改成功",
				result: result
			});
		} else if(flag == 2) {
			res.send({
				flag: 300,
				msg: "不存在该用户"
			});
		} else {
			console.log("err:" + err);
			res.send({
				flag: 300,
				msg: "修改失败"
			});
		}
	})
});
router.get("/session", function(req, res, next) {
	res.send(req.session.user);
});
module.exports = router;
module.exports.callback = callback;