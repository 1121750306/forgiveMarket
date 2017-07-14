//注册models监听
function initModel(models) {
	//用户模型
	userModel = models.user;
}


function addUser(_id, phone, password, cb) {

	var userEntity = new userModel({
		_id: _id,
		uname: phone, //默认为电话
		psw: password,
		phone: phone,
		balance: 0,
		avatar: "/img/innisfreeIcon/avatar.png" //默认头像
	});

	//保存
	userEntity.save(function(err, data) {
		if (!err) {
			cb(2, null, data);
		} else {
			cb(0, err, null);
		}
	});
}

/**
 * 注册
 * @param {Object} phone
 * @param {Object} password
 * @param {Function(flag, err, result)} cb flag（0：出错，1：已注册，2：可以注册）,err(错误信息),result(用户对象)
 */
function register(phone, password, cb) {
	console.log("进入register");
	userModel.find({
		phone: phone
	}).exec(function(err, docs) {
		console.log("进入检查用户是否存在");
		console.log("err:" + err + ",docs:" + docs)
		if (err) {
			cb(0, err, null);
			console.log("错误1");
		} else {
			if (docs.length == 0) {
				//没有注册
				console.log("没有注册");
				userModel.find({}).exec(function(err, docs) {
					//获取用户数量
					if (err) {
						cb(0, err, null);
					} else {
						var _id = docs.length + 1;
						addUser(_id, phone, password, cb);
					}
				});
			} else {
				//已经注册
				cb(1, err, null);
			}
		}
	})
}

/**
 * 登录
 * @param {Object} phone
 * @param {Object} password
 * @param {Function(flag,err,result)} cb flag（0：出错，1：无法登录，2：可以登录）,err(错误信息),result(用户对象)
 */
function login(phone, password, cb) {
	userModel.find({
		phone: phone
	}).exec(function(err, docs) {
		console.log("进入检查用户是否存在");
		console.log("err:" + err + ",docs:" + docs)
		if (err) {
			cb(0, err, null);
			console.log("错误1");
		} else {
			if (docs.length == 0 || docs == null) {
				cb(1, "不存在该用户", null);
			} else {
				console.log("pas:" + password + ",psw:" + docs[0]);
				if (password != docs[0].psw) {
					console.log("pas:" + password + ",psw:" + docs.psw);
					cb(1, "密码不正确", null);
				} else {
					
					cb(2, null, docs);
				}
			}
		}
	});
}
module.exports.initModel = initModel;
module.exports.register = register;
module.exports.login = login;