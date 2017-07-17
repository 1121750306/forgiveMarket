//注册models监听
function initModel(models) {
	//用户模型
	userModel = models.user;
}

function addUser(_id, phone, password, cb) {

	var userEntity = new userModel({
//		_id: _id,
		uname: phone, //默认为电话
		psw: password,
		phone: phone,
		balance: 0,
		avatar: "/img/innisfreeIco/avatar.png" //默认头像
	});

	//保存
	userEntity.save(function(err, data) {
		if(!err) {
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
		if(err) {
			cb(0, err, null);
			console.log("错误1");
		} else {
			if(docs.length == 0) {
				//没有注册
				console.log("没有注册");
				userModel.find({}).exec(function(err, docs) {
					//获取用户数量
					if(err) {
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
		if(err) {
			cb(0, err, null);
			console.log("错误1");
		} else {
			if(docs.length == 0 || docs == null) {
				cb(1, "不存在该用户", null);
			} else {
				console.log("pas:" + password + ",psw:" + docs[0]);
				if(password != docs[0].psw) {
					console.log("pas:" + password + ",psw:" + docs.psw);
					cb(1, "密码不正确", null);
				} else {

					cb(2, null, docs);
				}
			}
		}
	});
}

/**
 * 
 * @param {Object} _id 修改用户的id
 * @param {Object} uname 需要修改的昵称
 * @param {Object} photo 需要修改的头像
 * @param {Function(flag, err, result)} cb flag(1修改成功，2不存在该用户，3修改失败)
 */
function changeUserInfo(_id, uname, photo, cb) {
	_id = String(_id);
	console.log("changeUserInfo", "_id:" + _id + ",uname:" + uname + ",photo:" + photo);
	userModel.findById(_id, function(err, docs) {
		if(!err) {
			console.log("changeUserInfo", "docs:" + docs);
			if(docs == null) {
				cb(2, null, null);
			} else {
				if(uname != null) {
					docs.uname = uname;
				}
				if(photo != null) {
					docs.avatar = photo;
				}
				docs.save(function(err, updatedTank) {
					if(err) {
						cb(3, err, null);
					} else {
						cb(1, null, updatedTank);
					}
				});
			}
		} else {
			cb(3, err, null);
		}
	});
}

/**
 * 
 * @param {Object} _id 用户id
 * @param {Object} nowPwd 旧密码
 * @param {Object} newPwd 新密码
 * @param {Function(flag, err, result)} cb flag(1修改成功，2不存在该用户，3修改失败)
 */
function changePwd(_id, nowPwd, newPwd, cb) {
	_id = String(_id);
	console.log("changePwd", "_id:" + _id + ",nowPwd:" + nowPwd + ",newPwd:" + newPwd);
	userModel.findOne({_id:_id}, function(err, docs) {
		if(!err) {
			console.log("changePwd", "docs:" + docs);
			if(docs == null) {
				cb(2, null, null);
			} else {
				if(nowPwd != docs.psw) {
					cb(3, "密码错误", null);
					return;
				}
				docs.psw = newPwd;
				docs.save(function(err, updatedTank) {
					if(err) {
						cb(3, err, null);
					} else {
						cb(1, null, updatedTank);
					}
				});
			}
		} else {
			cb(3, err, null);
		}
	});
}

module.exports.initModel = initModel;
module.exports.register = register;
module.exports.login = login;
module.exports.changeUserInfo = changeUserInfo;
module.exports.changePwd = changePwd;