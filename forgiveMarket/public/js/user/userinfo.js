$(document).ready(function() {
	var user = JSON.parse(sessionStorage.user);
	console.log(user)
	$("#avatar img").attr("src", user.avatar);
	$("#uname .content").text(user.uname);
	$("#uid .content").text(user._id);
	$("#uname").click(function() {
		var muser = JSON.parse(sessionStorage.user);
		var newuname = prompt("请输入用户名", muser.uname);
		//		console.log(newuname)
		if (newuname) {
			$("#uname .content").text(newuname);
			$("#uname input").attr("value", newuname);
		}
	});
	$("#avatar input")[0].addEventListener("change", readData, false);
	$("#submit").click(function() {
		var formData = new FormData();
		var name = $("#uname input").val();
		formData.append("photo", $("#avatar input")[0].files[0]);
		formData.append("uname", name);
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
				if (data.flag == 200) {
					console.log(data.result);
					sessionStorage.user = JSON.stringify(data.result);
					toast("修改成功");
				} else {
					toast("修改失败");
				}
			}
		});
	})
});

function readData(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	var file = evt.dataTransfer !== undefined ? evt.dataTransfer.files[0] : evt.target.files[0];
	if (!file.type.match(/image.*/)) {
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
				$("#avatar img").attr("src", canvas.toDataURL("image/jpeg"));
			});
		}
	})(file);
	reader.readAsDataURL(file);
}