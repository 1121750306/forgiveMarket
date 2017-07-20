//订单项id
var otids;
//默认收货地址
var locations;

$(function() {
	//请求默认收货地址数据
	$.ajax({
		type: "get",
		url: "/location/getDefaultLocation",
		async: true,
		success: function(data) {
			locations = data[0];

			if (locations != null) {
				//默认收货地址已设置
				$(".banner_top").css("display", "flex");
				$(".banner_bottom").css("display", "flex");
				$(".username").html("收货人：" + locations.shname);
				$(".phone").html(locations.phone);
				$(".address").html("收货地址：" + locations.province + locations.city + locations.district + locations.address);

				//确认支付按钮绑定支付事件
				$(".goodscheck").on("click", pay);
			} else {
				//默认收货地址未设置
				$(".banner_attention").css("display", "flex");
			}

		},
		error: function(err) {
			console.log(err);
		}
	});

	//获取url中订单项数据
	otids = location.search.substr(7).split("&");

	//修改订单状态
	$.ajax({
		type: "post",
		url: "/order/updateorder",
		async: true,
		data: {},
		success: function(data) {

		}
	});

	for (var i = 0; i < otids.length; i++) {
		//请求订单项数据
		$.ajax({
			type: "get",
			url: "/order/getorderitembyid/" + otids[i],
			async: true,
			success: function(good) {
				//取得订单项的商品价格基数
				var price = good.gid.pricebase;

				//遍历商品规格
				var goodsizeUl = "";
				for (var j = 0; j < good.gsids.length; j++) {
					//拼接商品规格
					goodsizeUl = goodsizeUl + "<li><h3>" + good.gsids[j].gsid.gsname + "</h3></li>";

					//计算商品在此规格下价格偏移后的结果
					price = price + good.gsids[j].gsid.priceoffset;
				}

				//计算订单项商品折扣
				price = price * good.gid.discount;

				//计算订单项商品总价格
				var itemtotalprice = price * good.num;

				//加入总价
				var totalprice = parseFloat($(".totalprice").html().substr(4));
				totalprice = totalprice + itemtotalprice;
				$(".totalprice").html("总计￥:" + totalprice.toFixed(2));

				//组合li
				var li = '<li class="cart_item">\
							<div class="item_top">\
								<img src="/img/innisfree-img/goods/1000000311_l.png"/>\
								<div class="item_info">\
									<h2>' + good.gid.gname + '</h2>\
									<ul class="good_size">' + goodsizeUl + '</ul>\
									<div class="info_bottom">\
										<p class="item_price">￥' + price.toFixed(2) + '</p>\
										<p class="item_num">x' + good.num + '</p>\
									</div>\
								</div>\
							</div>\
							<div class="item_bottom">\
								<p class="item_totalnum">共' + good.num + '件商品</p>\
								<p class="item_totalprice">小计：￥' + itemtotalprice.toFixed(2) + '</p>\
							</div>\
						</li>';

				$(".cart").append(li);

			},
			error: function(err) {
				console.log(err);
			}
		});
	}

	//收货地址界面跳转
	$(".banner").click(function() {
		location.assign("/location");
	});

})

function pay() {
	console.log(locations);
	$.ajax({
		type: "post",
		url: "/order/createorder",
		datatype: "json",
		data: {
			otids: JSON.stringify({
				otid: otids
			}),
			flag: 200
		},
		async: true,
		success: function(data) {
			if (data.flag == 200) {
				toast("购买成功", "/views/order/orderlist.html?flag=2");
			} else {
				toast("购买失败");
			}
			console.log(data);
		}
	});
}