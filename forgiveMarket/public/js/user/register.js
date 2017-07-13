var phonem = /^1(3|4|5|7|8)\d{9}$/;
$(document).ready(function() {
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
	if (code == null || code == undefined || code == "") {
		$("#error").css("opacity", "1");
		$("#error").text("请输入验证码");
		return;
	}
	$.ajax({
		type: "post",
		url: "/users/register",
		async: true,
		data: {
			phone: phone,
			password: password,
			code: code
		},
		success: function(data) {
			console.log(data);
			if (data.flag == 200) {
				//注册成功
				var result = data.result;
			} else if(data.flag == 300){
				$("#error").css("opacity", "1");
				$("#error").text(data.msg);
			} else {
				$("#error").css("opacity", "1");
				$("#error").text("出错");
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
	//	console.log(phone + password)
}