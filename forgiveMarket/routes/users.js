var express = require('express');
var router = express.Router();
var user = require("../models/user")
var order = require("../models/order")
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');

//注册models监听并传递models
function callback(models) {
	user.initModel(models);
}
router.get('/getunamebyid/:uid', function(req, res, next) {
	var uid = req.params.uid;
	user.getUserNameById(uid, function(err, doc) {
		if(!err && doc != null) {
			res.send({
				flag: 200,
				result: doc
			});
		} else {
			res.send({
				flag: 300
			});
		}
	});
});

/**
 *注册 
 */
router.post('/register', function(req, res, next) {
	var phone = req.body.phone;
	var password = req.body.password;
	console.log("phone:" + phone + ",password:" + password);
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
			req.session.user = [result];
			json = {
				flag: 200,
				msg: "注册成功",
				result: [result]
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
		
		var uname = fields.uname != undefined && fields.uname != "" ? fields.uname[0] : null;
		var sex = fields.sex != undefined && fields.sex != "" ? fields.sex[0] : 0;
		var signal = fields.signal != undefined && fields.signal != "" ? fields.signal[0] : null;
		var avatar = files.photo != undefined ? files.photo[0] : null;
		var avatarPath = avatar != null ? avatar.path : null;
		var ubg = files.bgphoto != undefined ? files.bgphoto[0] : null;
		var ubgPath = ubg != null ? ubg.path : null;
		console.log("uname:" + uname);
		console.log("sex" + sex)
		console.log('signal:' + signal);
		console.log('avatarPath:' + avatarPath);
		console.log('ubgPath:' + ubgPath);
		if(avatarPath != null) {
			avatarPath = avatarPath.substr(avatarPath.indexOf("\\"), avatarPath.length);
		}
		if(ubgPath != null) {
			ubgPath = ubgPath.substr(ubgPath.indexOf("\\"), ubgPath.length);
		}
		user.changeUserInfo(req.session.user[0]._id, uname, avatarPath, sex, signal, ubgPath, function(flag, err, result) {
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

router.post("/searchgood", function(req, res, next) {
	var content = req.body.content;
	console.log("content:" + content);
	user.searchGood(content, function(err, docs) {
		console.log(err);
		if(!err) {
			res.send({
				flag: 200,
				msg: "搜索成功",
				result: docs
			});
		} else {
			res.send({
				flag: 300,
				msg: "搜索失败",
			});
		}

	})
});

/**
 *获取Top6 
 */
router.all("/gettopgoods", function(req, res, next) {
	var content = req.body.content;
	console.log("content:" + content);
	user.getTopGoods(function(err, docs) {
		console.log(err);
		res.send({
			flag: 200,
			msg: "推荐成功",
			result: docs
		});;
	})

});

/**
 * 获奖用户
 */
router.all("/getrandomuser", function(req, res, next) {

	user.randowUser(function(err, result) {
		if(!err) {
			res.send({
				flag: 200,
				result: result
			});
		} else {
			res.send({
				flag: 300,
				msg: err
			});
		}
	});
});

router.all("/getordernumber", function(req, res, next) {
	if(req.session.user == null) {
		res.send({
			flag: 300,
			msg: "未登录"
		});
		return;
	}
	var uid = req.session.user[0]._id;
	order.getOrderNumber(uid, function(err, result) {
		console.log("send:" + result);
		res.send(result);
	})
});
module.exports = router;
module.exports.callback = callback;