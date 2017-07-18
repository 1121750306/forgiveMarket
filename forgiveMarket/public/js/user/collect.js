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
						var ul = document.createElement("ul");
						$(ul).addClass("clear");
						var dateLi = document.createElement("li");
						$(dateLi).addClass("date_year");
						var dateP = document.createElement("p");
						$(dateP).text(result[i].date);
						dateLi.appendChild(dateP);
						ul.appendChild(dateLi);

						for (var j = 0; j < result[i].goods.length; j++) {
							let html = `<li gid='${result[i].goods[j].gid}'>\
								<img src="../../img/innisfree-img/goods/1000000336_l.png" />\
								<h2>${result[i].goods[j].goodname}</h2>\
								<span class="price">￥${result[i].goods[j].goodprice}</span>\
							</li>`;
							$(ul).append(html);
						}
						$("#history_content")[0].appendChild(ul);
					}
				}
				$("#history_content ul li").each(function() {
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
})