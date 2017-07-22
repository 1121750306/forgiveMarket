function getTopSix(callback) {
	$.ajax({
		type: "post",
		url: "/users/gettopgoods",
		async: true,
		success: function(data) {
			callback(data, null);
		},
		fail:function(err){
			callback(null, err);
		}
	});
}
getTopSix(function(data, err) {
    console.log(data)
    if (err) {
        console.log(err);
        return;
    }
    if (data.flag == 200) {
        for (var i = 0; i < data.result.length; i++) {
            var divId = 'top' + i;
            var html = `<div id='${divId}' class="hotgood" gid='${data.result[i].good._id}'>\
								<div>\
									<img src="/img/innisfreeIco/pic_loading.png" />\
									<span class="good_name">${data.result[i].good.gname}</span>\
									<span class="good_price">¥${data.result[i].good.pricebase}</span>
								</div>\
							</div>`;
            $("#hotgoods-container").append(html);
            setImage($("#" + divId), data.result[i].good._id);
        }
        //跳转商品详情
        $("#hotgoods-container .hotgood div").each(function() {
            var div = $(this);
            div.click(function() {
                var gid = div.parent().attr("gid");
                console.log(gid);
                if (gid != undefined) {
                    window.location.assign("/views/goodInfo/goodInfo.html?gid=" + gid);
                }
            })
        });
    }
})