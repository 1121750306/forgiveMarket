var phonem = /^1(3|4|5|7|8)\d{9}$/;
$(document).ready(function() {
	//初始化bmob
	Bmob.initialize("39aceb7ec7b1fadab42c3c5240d8d843", "f518a18e8a118cf90550b44aa8fc75c9");

	$("#show_pwd").click(function() {
		var type = $("#div_show_pwd .input").attr("type");
		if (type == "password") {
			$("#div_show_pwd .input").attr("type", "text");
			$("#show_pwd").css("background-image", "url(../../img/innisfreeIco/close_eye.png)")
		} else if (type == "text") {
			$("#div_show_pwd .input").attr("type", "password");
			$("#show_pwd").css("background-image", "url(../../img/innisfreeIco/eye.png)")
		}
	});

	$("#get_code").click(function() {
		var phone = $("#phone").val();
		if (!phonem.test(phone)) {
			$("#error").css("opacity", "1");
			$("#error").text("手机号码错误");
			return;
		}
		Bmob.Sms.requestSmsCode({
			"mobilePhoneNumber": phone,
			"template": "注册短信验证"
		}).then(function(obj) {
			console.log("smsId:" + obj.smsId);
		}, function(err) {
			console.log("发送失败:" + err);
		});
	})
	$("#register").click(register);
});

function register() {
	var phone = $("#phone").val();
	var password = $("#password").val();
	var code = $("#code").val();
	if (!phonem.test(phone)) {
		$("#error").css("opacity", "1");
		$("#error").text("手机号码错误");
		return;
	}
	if (password == null || password == undefined || password == "") {
		$("#error").css("opacity", "1");
		$("#error").text("请输入密码");
		return;
	}
	Bmob.Sms.verifySmsCode(phone, code).then(function(obj) {
		console.log("msg:" + obj.msg); //
		$.ajax({
			type: "post",
			url: "/users/register",
			async: true,
			data: {
				phone: phone,
				password: password
			},
			success: function(data) {
				//			console.log(data);
				if (data.flag == 200) {
					//注册成功
					var result = data.result[0];
					sessionStorage.user = JSON.stringify(result);
					window.location.assign("/views/user/user.html");
				} else if (data.flag == 300) {
					$("#error").css("opacity", "1");
					$("#error").text(data.msg);
				} else {
					$("#error").css("opacity", "1");
					$("#error").text("出错");
				}
			},
			error: function(err) {
				//			console.log(err);
			}
		}, function(err) {
			console.log("发送失败:" + err);
		});

	});
	//	console.log(phone + password)
}