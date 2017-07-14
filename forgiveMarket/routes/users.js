var express = require('express');
var router = express.Router();
var user = require("../models/user")

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
		if (flag == 0) {
			json = {
				flag: 300,
				msg: err
			};
		} else if (flag == 1) {
			json = {
				flag: 300,
				msg: "已存在该用户"
			};
		} else if (flag == 2) {
			req.session.user = result;
			json = {
				flag: 200,
				msg: "注册成功",
				result: result
			};
		}
		res.send(json);
	})

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
		if (flag == 0 || flag == 1) {
			json = {
				flag: 300,
				msg: err
			};
		} else if (flag == 2) {
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

router.post("/logout", function(req, res, next) {
	req.session.user = null;
	res.send({
		flag: 200
	});
});

module.exports = router;
module.exports.callback = callback;