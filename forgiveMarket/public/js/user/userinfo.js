$(document).ready(function() {
	var user = JSON.parse(sessionStorage.user);
	console.log(user)
	$("#avatar img").attr("src", user.avatar);
	$("#uname .content").text(user.uname);
	$("#uid .content").text(user._id);
	$("#sex .content").text(user.sex == 1 ? "男" : "女");

	if(user.signal == undefined || user.signal == null ||
		user.signal == "undefined" || user.signal == "null" || user.signal == "") {
		$("#signal .content").text("没有签名");
	} else {
		$("#signal .content").text(user.signal);
	}
	if(user.ubg == undefined || user.ubg == null ||
		user.ubg == "undefined" || user.ubg == "null" || user.ubg == "") {
		$("#ubg img").attr("src", "/img/innisfreeIco/ubg.jpg");
	} else {
		$("#ubg img").attr("src", user.ubg);
	}

	$("#uname").click(function() {
		$("#div_uname input").val(user.uname);
		showEditUname();
	});

	$("#sex").click(function() {
		showSelectSex();
	});

	$("#signal").click(function() {
		$("#div_signal textarea").val(user.signal);
		showEditSignal();
	});

	$("#avatar img").click(function() {
		$("#input_avatar").click();
	})
	$("#ubg img").click(function() {
		$("#input_ubg").click();
	})

	$("#avatar input")[0].addEventListener("change", readDataByAvater, false);
	$("#ubg input")[0].addEventListener("change", readDataByBg, false);
	$("#submit").click(function() {
		var formData = new FormData();
		formData.append("photo", $("#avatar input")[0].files[0]);
		formData.append("bgphoto", $("#ubg input")[0].files[0]);
		formData.append("uname", user.uname);
		formData.append("sex", user.sex);
		formData.append("signal", user.signal);
		$.ajax({
			type: "post",
			url: "/users/changeavatar",
			data: formData,
			// 告诉jQuery不要去处理发送的数据
			processData: false,
			// 告诉jQuery不要去设置Content-Type请求头
			contentType: false,
			async: true,
			success: function(data) {
				//				console.log(data)
				if(data.flag == 200) {
					console.log(data.result);
					sessionStorage.user = JSON.stringify(data.result);
					toast("修改成功");
				} else {
					console.log("msg:" + data.flag);
					toast("修改失败");
				}
			}
		});
	})

	$("#boy").click(function() {
		user.sex = 1;
		$("#sex .content").text(user.sex == 1 ? "男" : "女");
		dismissSelectSex();
		event.stopPropagation();
	});
	$("#girl").click(function() {
		user.sex = 2;
		$("#sex .content").text(user.sex == 1 ? "男" : "女");
		dismissSelectSex();
		event.stopPropagation();
	});
	$("#div_sex").click(function() {
		dismissSelectSex();
	})
	$("#sp_detemine").click(function() {
		var content = $("#div_signal textarea").val();
		console.log(content);
		user.signal = content;
		$("#signal .content").text(user.signal);
		dismissEditSignal();
	});
	$("#cancel").click(function() {
		dismissEditSignal();
	});
	$("#sp_uname_save").click(function() {
		var content = $("#div_uname input").val();
		console.log(content);
		user.uname = content;
		$("#uname .content").text(user.uname);
		dismissEditUname();
	});
	$("#uname_cancel").click(function() {
		dismissEditUname();
	});
});

function readData(evt, obj) {
	evt.stopPropagation();
	evt.preventDefault();
	var file = evt.dataTransfer !== undefined ? evt.dataTransfer.files[0] : evt.target.files[0];
	if(!file.type.match(/image.*/)) {
		return;
	}
	var reader = new FileReader();
	reader.onload = (function() {
		return function(e) {
			var img = new Image();
			img.src = e.target.result;
			img.onload = (function() {
				var canvas = document.createElement('canvas');
				canvas.width = 800;
				canvas.height = 800;
				var ctx = canvas.getContext("2d");
				ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas清屏  
				//重置canvans宽高 canvas.width = img.width; canvas.height = img.height;  
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 将图像绘制到canvas上   
				//				canvas.toDataURL("image/jpeg"); //必须等压缩完才读取canvas值，否则canvas内容是黑帆布  
				obj.attr("src", canvas.toDataURL("image/jpeg"));
			});
		}
	})(file);
	reader.readAsDataURL(file);
}

function readDataByAvater(evt) {
	readData(evt, $("#avatar img"));
}

function readDataByBg(evt) {
	readData(evt, $("#ubg img"));
}

function showSelectSex() {
	$("#div_sex").animate({
		top: '0'
	}, 300);
}

function dismissSelectSex() {
	$("#div_sex").animate({
		top: "100%"
	}, 300);
}

function showEditSignal() {
	$("#div_signal").animate({
		top: '0'
	}, 300);
}

function dismissEditSignal() {
	$("#div_signal").animate({
		top: "100%"
	}, 300);
}

function showEditUname() {
	$("#div_uname").animate({
		top: '0'
	}, 300);
}

function dismissEditUname() {
	$("#div_uname").animate({
		top: "100%"
	}, 300);
}