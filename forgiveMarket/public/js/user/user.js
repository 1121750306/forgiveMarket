$(function() {
	console.log(sessionStorage.user);
	var userjson = sessionStorage.user;
	if(userjson != null && userjson != "null" && userjson != undefined && userjson != "undefined") {
		var user = JSON.parse(userjson);
		//		console.log(user);
		//已经登录
		$("#login").css("display", "block");
		$("#user_function").css("display", "block");
		$("#unlogin").css("display", "none");
		$("#username").text(user.uname);
		$("#user_photo img").attr("src", user.avatar);
		if(user.signal == undefined || user.signal == null ||
			user.signal == "undefined" || user.signal == "null" || user.signal == "") {
			$("#signal").text("没有签名");
		} else {
			$("#signal").text(user.signal);
		}
		if(user.ubg == undefined || user.ubg == null ||
			user.ubg =="undefined" || user.ubg == "null" || user.ubg == "") {
			$("#ubg").attr("src", "/img/innisfreeIco/ubg.jpg");
		} else {
			$("#ubg").attr("src", user.ubg);
		}
		$("#ubg").css("display", "block");
	} else {
		$("#login").css("display", "none");
		$("#user_function").css("display", "none");
		$("#unlogin").css("display", "block");
	}

	fixAvatar();

	$("#logout").click(function() {
		$.ajax({
			type: "post",
			url: "/users/logout",
			async: true,
			success: function(data) {
				sessionStorage.removeItem("user");
				location.reload();
			}

		});
	})

	$("#login").click(function() {
		window.location.assign("/views/user/userinfo.html");
	})
	addOnLoginListener(function(err, result) {
		if(err) {

		} else {
			dismissLogin();
			location.reload();
		}
	});

	//订单数量
	$.ajax({
		type: "post",
		url: "/users/getordernumber",
		async: true,
		success: function(data) {
			$("#unpay span").text(data[0].number);
			$("#paid span").text(data[1].number);
			$("#send span").text(data[2].number);
			$("#accept span").text(data[3].number);
			$("#finish span").text(data[4].number);
		}
	});
});


function fixAvatar(){
	var width = $("#user_info").width();
	$("#user_photo img").width(width*0.2);
	$("#user_photo img").height(width*0.2);
}
