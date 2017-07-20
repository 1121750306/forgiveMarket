$(document).ready(function() {
	$.ajax({
		type: "post",
		url: "/collect/querycollect",
		async: true,
		dataType: 'json',
		success: function(data) {
			console.log(data);
			if (data.flag == 200) {
				var result = data.result;
				if (result != null && result.length != 0) {
					for (var i = 0; i < result.length; i++) {
						var liId = "good_li" + i;
						let html = `<li id='${liId}' gid='${result[i].gid}'>\
								<img src="/img/innisfreeIco/pic_loading.png" />\
								<div>\
									<h2>${result[i].name}</h2>\
									<span class="collect_type">${result[i].type}</span>\
								</div>\
								<span class="collect_price">${result[i].price}</span>\
								<span class="collect_date">${result[i].time}</span>\
								<i class="collect_delete"></i>\
							</li>`;
						$("#collect_content ul").append(html);
						setImage($("#collect_content ul").find("#" + liId), result[i].gid);
					}
				}
			}
			$("#collect_content ul li").each(function() {
				var li = $(this);
				li.click(function() {
					console.log($(this).attr("gid"));
					var gid = $(this).attr("gid");
					if (gid != undefined) {
						window.location.assign("/views/goodInfo/goodInfo.html?gid=" + $(this).attr("gid"));
					}
				})
			});
			$("#collect_content ul li .collect_delete").each(function() {
				var i = $(this);
				i.click(function() {
					var gid = $(this).parent().attr("gid");
					console.log(gid);
					event.stopPropagation();
					var userjson = sessionStorage.user;
					var user = JSON.parse(userjson);
					$.ajax({
						type: "post",
						url: "/collect/removecollect",
						async: true,
						dataType: 'json',
						data: {
							uid: user._id,
							gid: gid
						},
						success: function(data) {
							console.log(data);
							if (data.flag == 200) {
								window.location.reload();
							} else {

							}
						}
					});
				})
			});
		},
		fail: function(err) {
			console.log(err);
		}
	});
});


function setImage(obj, gid) {
	console.log(obj);
	//获取图片路径
	$.ajax({
		type: "get",
		url: "/goodphoto/getShowPhoto/" + gid,
		async: true,
		success: function(data) {
			console.log(data);
			obj.find("img").attr("src", '/img/upload/' + data);
		}
	});
}