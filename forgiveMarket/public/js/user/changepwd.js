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

	$("#change").click(changepwd);
});

function changepwd() {
	var now_pwd = $("#now_pwd").val();
	var password = $("#password").val();
	var code = $("#code").val();
	if (now_pwd == null || now_pwd == undefined || now_pwd == "") {
		$("#error").css("opacity", "1");
		$("#error").text("请输入密码");
		return;
	}
	if (password == null || password == undefined || password == "") {
		$("#error").css("opacity", "1");
		$("#error").text("请输入密码");
		return;
	}
	$.ajax({
		type: "post",
		url: "/users/changepwd",
		async: true,
		data: {
			nowpwd: now_pwd,
			password: password
		},
		success: function(data) {
			console.log(data);
			if (data.flag == 200) {
				//修改密码成功
				var result = data.result;
				window.location.assign("/views/user/user.html");
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