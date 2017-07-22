$(function() {
	console.log(sessionStorage.user);
	var userjson = sessionStorage.user;
	if(userjson != null && userjson != "null" && userjson != undefined && userjson != "undefined") {
		var user = JSON.parse(userjson);
		console.log(user);
		//已经登录
		$("#login").css("display", "block");
		$("#user_function").css("display", "block");
		$("#unlogin").css("display", "none");
		$("#username").text(user.uname);
		$("#user_photo img").attr("src", user.avatar);
		$("#balance").text("余额：￥" + user.balance);
	} else {
		$("#login").css("display", "none");
		$("#user_function").css("display", "none");
		$("#unlogin").css("display", "block");
	}

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