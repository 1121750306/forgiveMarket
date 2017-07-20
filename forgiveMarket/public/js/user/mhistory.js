$(document).ready(function() {
	$.ajax({
		type: "post",
		url: "/history/queryHistory",
		async: true,
		dataType: 'json',
		success: function(data) {
			console.log(data);
			if (data.flag == 200) {
				var result = data.result;
				if (result != null && result.length != 0) {
					for (var i = 0; i < result.length; i++) {
						var ul = document.createElement("ul");
						$(ul).addClass("clear");
						var dateLi = document.createElement("li");
						$(dateLi).addClass("date_year");
						var dateP = document.createElement("p");
						$(dateP).text(result[i].date);
						dateLi.appendChild(dateP);
						ul.appendChild(dateLi);

						for (var j = 0; j < result[i].goods.length; j++) {
							var liId = "good_li" + j;
							let html = `<li id='${liId}' gid='${result[i].goods[j].gid}'>\
								<img src="../../img/innisfree-img/goods/1000000336_l.png" />\
								<h2>${result[i].goods[j].goodname}</h2>\
								<span class="price">￥${result[i].goods[j].goodprice}</span>\
							</li>`;
							$(ul).append(html);
							setImage($(ul).find("#" + liId), result[i].goods[j].gid);
						}
						$("#history_content_real").append(ul);
						if (result[i].goods.length % 2 == 1) {
							$(ul).children().last().width("98%");
							$(ul).children().last().children().eq(0).width("20%");
							$(ul).children().last().children().eq(1).css("left","22.5%");
							$(ul).children().last().children().eq(2).css("left","22.5%");
						}
					}
				}
				$("#history_content_real ul li").each(function() {
					var li = $(this);
					li.click(function() {
						console.log($(this).attr("gid"));
						var gid = $(this).attr("gid");
						if (gid != undefined) {
							window.location.assign("/views/goodInfo/goodInfo.html?gid=" + $(this).attr("gid"));
						}
					})
				})
			} else {

			}
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