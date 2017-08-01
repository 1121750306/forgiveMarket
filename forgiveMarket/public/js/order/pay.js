//订单项id
var otids;
//默认收货地址
var locations;
//订单号
var orderid = null;
$(function() {
	//加载白幕控制
	var loading = 2;
	loadstart();
	
	//请求默认收货地址数据
	$.ajax({
		type: "get",
		url: "/location/getDefaultLocation",
		async: true,
		success: function(data) {
			locations = data[0];

			if(locations != null) {
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

			loading--;
			if(loading == 0) {
				//加载完成
				loadcomplete();
			}

		},
		error: function(err) {
			//加载失败
			loadfail();
			console.log(err);
		}
	});

	//获取url中订单项数据
	var params = location.search.split("&&");

	otids = params[0].substr(7).split("&");
	if(params.length == 2) {
		orderid = params[1].substr(4);
	}

	//记录需要请求的订单项总数量
	var otnum = otids.length;

	for(var i = 0; i < otids.length; i++) {
		(function(i) {
			//请求订单项数据
			$.ajax({
				type: "get",
				url: "/order/getorderitembyid/" + otids[i],
				async: true,
				success: function(good) {
					//获取照片
					$.ajax({
						type: "get",
						url: "/goodphoto/getShowPhoto/" + good.gid._id,
						async: true,
						success: function(photo) {
							//取得订单项的商品价格基数
							var price = good.gid.pricebase;

							//遍历商品规格
							var goodsizeUl = "";
							for(var j = 0; j < good.gsids.length; j++) {
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
							var li = '<li class="cart_item" gid="' + good.gid._id + '">\
										<div class="item_top">\
											<img src="/img/upload/' + photo + '"/>\
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

							otnum--;
							if(otnum == 0) {
								loading--;
								if(loading == 0) {
									//加载完成
									loadcomplete();
								}
							}

						},
						error: function(err) {
							//加载失败
							loadfail();
							console.log(err);
						}

					});

				},
				error: function(err) {
					//加载失败
					loadfail();
					console.log(err);
				}
			});

		})(i);
	}

	//收货地址界面跳转
	$(".banner").click(function() {
		location.assign("/location");
	});

	//商品页面跳转控制
	$(".cart").on("mouseup", ".cart_item", function(e) {
		var gid = $(this).attr("gid");

		location.assign("/views/goodInfo/goodInfo.html?gid=" + gid);

	})

})

function pay() {
	console.log(locations);
	if(orderid == null) {
		//未创建订单
		createOrder(function(data) {
			console.log(data);
			if(data.flag == 200) {
				orderid = data.result._id;
				showPay();
			} else {
				toast(data.msg);
			}

		});
	} else {
		showPay();
	}

}

/**
 * 显示支付页面
 */
function showPay() {
	$("#order_id_content").text(orderid);
	var userjson = sessionStorage.user;
	var user = JSON.parse(userjson);
	$("#order_user_content").text(user.phone);

	var total = $(".totalprice").html().substr(4);
	$("#order_total_content").text("￥" + total);

	$("#btn_pay").click(function() {
		$("#lodaing").css("display", "block");
		console.log(getPassword())
		if(getPassword() == "123456") {
			//支付成功
			buy();
		} else {
			errorPoint.style.display = "block";
			this.value = "密码不正确";
		}
	});
	$("#pay_title i").click(function() {
		$("#pay").animate({
			top: '100%'
		}, 300);
	});
	$("#pay").animate({
		top: 0
	}, 300);
}

function createOrder(cb) {
	$.ajax({
		type: "post",
		url: "/order/createorder",
		datatype: "json",
		data: {
			otids: JSON.stringify({
				otid: otids
			}),
			locationid: locations._id
		},
		async: true,
		success: function(data) {
			cb(data);
		},
		fail: function(err) {
			toast("购买失败");
			$("#lodaing").css("display", "none");
		}
	});
}

function buy() {
	$.ajax({
		type: "post",
		url: "/order/updateorder",
		async: true,
		data: {
			otid: orderid,
			flag: 2
		},
		success: function(data) {
			$("#lodaing").css("display", "none");
			if(data.type == 'success') {
				toast("购买成功", "/views/order/orderlist.html?flag=2");
			} else {
				toast("购买失败");
			}
		},
		fail: function(err) {
			toast("购买失败");
			$("#lodaing").css("display", "none");
		}
	});
}
var box = document.getElementsByClassName("box")[0];

function createDIV(num) {
	for(var i = 0; i < num; i++) {
		var pawDiv = document.createElement("div");
		pawDiv.className = "pawDiv";
		box.appendChild(pawDiv);
		var paw = document.createElement("input");
		paw.type = "password";
		paw.className = "paw";
		paw.maxLength = "1";
		paw.readOnly = "readonly";
		pawDiv.appendChild(paw);
	}
}
createDIV(6);

var pawDiv = document.getElementsByClassName("pawDiv");
var paw = document.getElementsByClassName("paw");
var pawDivCount = pawDiv.length;
/*设置第一个输入框默认选中*/
pawDiv[0].setAttribute("style", "border: 1px solid deepskyblue;");
paw[0].readOnly = false;
paw[0].focus();

var errorPoint = document.getElementsByClassName("errorPoint")[0];
/*绑定pawDiv点击事件*/

function func() {
	for(var i = 0; i < pawDivCount; i++) {
		pawDiv[i].addEventListener("click", function() {
			pawDivClick(this);
		});
		paw[i].onkeyup = function(event) {
			console.log(event.keyCode);
			if((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
				/*输入0-9*/
				changeDiv();
				errorPoint.style.display = "none";

			} else if(event.keyCode == "8") {
				/*退格回删事件*/
				firstDiv();

			} else if(event.keyCode == "13") {
				/*回车事件*/
				getPassword();

			} else {
				/*输入非0-9*/
				errorPoint.style.display = "block";
				this.value = "";
			}

		};
	}

}
func();

/*定义pawDiv点击事件*/
var pawDivClick = function(e) {
	for(var i = 0; i < pawDivCount; i++) {
		pawDiv[i].setAttribute("style", "border: 1px solid transparent;");
	}
	e.setAttribute("style", "border: 1px solid deepskyblue;");
};

/*定义自动选中下一个输入框事件*/
var changeDiv = function() {
	for(var i = 0; i < pawDivCount; i++) {
		if(paw[i].value.length == "1") {
			/*处理当前输入框*/
			paw[i].blur();

			/*处理上一个输入框*/
			paw[i + 1].focus();
			paw[i + 1].readOnly = false;
			pawDivClick(pawDiv[i + 1]);
		}
	}
};

/*回删时选中上一个输入框事件*/
var firstDiv = function() {
	for(var i = 0; i < pawDivCount; i++) {
		console.log(i);
		if(paw[i].value.length == "0") {
			/*处理当前输入框*/
			console.log(i);
			paw[i].blur();

			/*处理上一个输入框*/
			paw[i - 1].focus();
			paw[i - 1].readOnly = false;
			paw[i - 1].value = "";
			pawDivClick(pawDiv[i - 1]);
			break;
		}
	}
};

/*获取输入密码*/
var getPassword = function() {
	var n = "";
	for(var i = 0; i < pawDivCount; i++) {
		n += paw[i].value;
	}
	return n;
};

/*键盘事件*/
document.onkeyup = function(event) {
	if(event.keyCode == "13") {
		/*回车事件*/
		getPassword();
	}
};