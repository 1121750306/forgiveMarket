//注册models监听
function initModel(models) {
	//用户模型
	userModel = models.user;
}

function getUserNameById(uid, cb) {
	userModel.findOne({
		_id: uid
	}, cb);
}

function addUser(phone, password, cb) {

	var userEntity = new userModel({
		uname: phone, //默认为电话
		psw: password,
		phone: phone,
		balance: 0,
		avatar: "/img/innisfreeIco/avatar.png" //默认头像
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
				addUser(phone, password, cb);
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
 * @param {Function(flag,err,result)} cb flag（0：出错，1：密码错误，2：账号不存在，3：可以登录）,err(错误信息),result(用户对象)
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
				cb(2, "不存在该用户", null);
			} else {
				console.log("pas:" + password + ",psw:" + docs[0]);
				if (password != docs[0].psw) {
					console.log("pas:" + password + ",psw:" + docs.psw);
					cb(1, "密码不正确", null);
				} else {
					cb(3, null, docs);
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
		if (!err) {
			console.log("changeUserInfo", "docs:" + docs);
			if (docs == null) {
				cb(2, null, null);
			} else {
				if (uname != null) {
					docs.uname = uname;
				}
				if (photo != null) {
					docs.avatar = photo;
				}
				docs.save(function(err, updatedTank) {
					if (err) {
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
	userModel.findOne({
		_id: _id
	}, function(err, docs) {
		if (!err) {
			console.log("changePwd", "docs:" + docs);
			if (docs == null) {
				cb(2, null, null);
			} else {
				if (nowPwd != docs.psw) {
					cb(3, "密码错误", null);
					return;
				}
				docs.psw = newPwd;
				docs.save(function(err, updatedTank) {
					if (err) {
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

function randowUser(cb) {
	userModel.find({}).then(function(docs) {
		if (docs == null || docs.length == 0) {
			cb("没有用户", null);
			return;
		}

		var index = parseInt(Math.random() * docs.length);
		var user = docs[index];
		cb(null, user);
	}, function(err) {
		cb(err, null);
	});
}

/**
 * 商品搜索
 * @param {Object} content 搜索关键字
 * @param {Object} cb
 */
function searchGood(content, cb) {
	var sreacKeyRegExp = new RegExp(content, 'i');
	goodModel.find({}).populate({
		path: 'typeid',
		select: 'tname'
	}).exec(function(err, docs) {
		if (docs != null && docs.length != 0) {
			var result = [];
			for (var i = 0; i < docs.length; i++) {
				if (docs[i].gname.match(content)) {
					result[result.length] = {
						gid: docs[i]._id,
						gname: docs[i].gname,
						type: docs[i].typeid.tname,
						price: docs[i].pricebase,
						discount: docs[i].discount
					}
					continue;
				}

				if (docs[i].typeid != null && docs[i].typeid != undefined && docs[i].typeid.tname.match(content)) {
					result[result.length] = {
						gid: docs[i]._id,
						gname: docs[i].gname,
						type: docs[i].typeid.tname,
						price: docs[i].pricebase,
						discount: docs[i].discount
					}
				}
			}
			cb(err, result);
		} else {
			cb(err, []);
		}
	});
}

/**
 * 获取推荐商品TOP6
 * @param {Object} cb
 */
function getTopGoods(cb) {
	var promise = goodModel.find({}).exec();
	promise.then(function(result) {
		console.log(result);
		if (result == null || result.length == 0) {
			//若没有商品则直接返回null
			return new Promise(function(resolve, reject) {
				resolve(null);
			});
		}
		var promises = [];
		for (var i = 0; i < result.length; i++) {
			console.log("data:" + result[i]);
			promises.push(goodsizeModel.find({
				gid: result[i]._id
			}));
		};
		//返回商品信息
		promises.push(new Promise(function(resolve, reject) {
			resolve(result);
		}))
		return Promise.all(promises);
	}, function(err) {
		console.log(err);
	}).then(function(result) {
		if (result == null || result.lenght == 0) {
			cb(null, result);
			return;
		}
		var goods = result[result.length - 1];
		var goodinfos = [];
		for (var i = 0; i < goods.length; i++) {
			var sales = 0;
			for (var j = 0; j < result[i].length; j++) {
				sales += result[i][j].sales;
			}
			console.log("goods" + goods[i].gname + ",sale:" + sales);
			goodinfos[goodinfos.length] = {
				good: goods[i],
				sales: sales
			};
		}
		//排序
		goodinfos.sort(function(x, y) {
			if (x.sales < y.sales) {
				return 1;
			} else if (x.sales > y.sales) {
				return -1;
			} else {
				return 0;
			}
		});
		if (goodinfos.length > 6) {
			goodinfos.length = 6;
		}
		cb(null, goodinfos);
		console.log(result);
	}, function(err) {
		cb(err, null);
	});
}
module.exports.initModel = initModel;
module.exports.register = register;
module.exports.login = login;
module.exports.changeUserInfo = changeUserInfo;
module.exports.changePwd = changePwd;
module.exports.searchGood = searchGood;
module.exports.getTopGoods = getTopGoods;
module.exports.getUserNameById = getUserNameById;
module.exports.randowUser = randowUser;