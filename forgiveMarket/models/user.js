//var base = require("./base");
//base.callback(function(models) {
//	//用户模型
//	userModel = models.user;
//})

function addUser() {
	var userEntity = new userModel({
		_id: "4",
		uname: "lihanguang",
		psw: "abc123",
		phone: "12321231312",
		balance: 153.32,
		avatar: "a.jpg"
	});
	//保存
	userEntity.save(function(err, data) {
		if (!err) {
			console.log("user added");
			console.log(data);
		} else {
			console.log(err.message);
		}
	});
}
module.exports.addUser = addUser;

function callback(data) {
	userModel = data.user;
}

module.exports.callback = callback;