var phonem = /^1(3|4|5|7|8)\d{9}$/;
var listener = null;
$(document).ready(function() {
	$("#show_pwd").click(function() {
		var type = $("#div_show_pwd .input").attr("type");
		if(type == "password") {
			$("#div_show_pwd .input").attr("type", "text");
			$("#show_pwd").css("background-image", "url(../../img/innisfreeIco/close_eye.png)")
		} else if(type == "text") {
			$("#div_show_pwd .input").attr("type", "password");
			$("#show_pwd").css("background-image", "url(../../img/innisfreeIco/eye.png)")
		}
	});
	$("#btn_login").click(login);

	$("#login_close").click(function() {
		$("body").css("overflow","auto");
		$("#div_login").animate({
			left: '-100%'
		}, 300);
	})
})

function login() {
	var phone = $("#phone").val();
	var password = $("#password").val();
	if(!phonem.test(phone)) {
		$("#error").css("opacity", "1");
		$("#error").text("手机号码错误");
		return;
	}
	if(password == null || password == undefined || password == "") {
		$("#error").css("opacity", "1");
		$("#error").text("请输入密码");
		return;
	}
	$.ajax({
		type: "post",
		url: "/users/login",
		async: true,
		data: {
			phone: phone,
			password: password,
		},
		success: function(data) {
			console.log(data);
			if(data.flag == 200) {
				//登录成功
				var result = data.result;
				sessionStorage.user = JSON.stringify(result[0]);
				if(listener != null) {
					listener(null, result);
				}
			} else if(data.flag == 300) {
				$("#error").css("opacity", "1");
				$("#error").text(data.msg);
				if(listener != null) {
					listener(data.msg, null);
				}
			} else {
				$("#error").css("opacity", "1");
				$("#error").text("出错");
				if(listener != null) {
					listener("出错", null);
				}
			}
		},
		error: function(err) {
			console.log(err);
		}
	});
	//	console.log(phone + password)
}

function showLogin() {
	$("body").css("overflow","hidden");
	$("#div_login").animate({
		left: '0%'
	}, 300);
}

function dismissLogin() {
	$("#div_login").css({
		left: "-100%"
	});
	$("body").css("overflow","auto");
}

/**
 * 
 * @param {Function(err, result)} l
 */
function addOnLoginListener(l) {
	listener = l;
}