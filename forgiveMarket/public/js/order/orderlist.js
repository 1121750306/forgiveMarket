$(function() {
	//获取url中订单页指向， 0.未付款 1.已付款 2.已发货 3.已收货 4.已完成
	var view = parseInt(location.search.substr(6)) - 1;
	
	//加载界面
	reloadView(view)
	
	//订单页控制
	$(".order_type li").click(function(){
		var index = $(this).index();
		if (index != view) {
			reloadView(index);
		}
	});
	
	//商品评论控制
	$(".com_cancel").click(function(){
		$(".comment").animate({top:"100%"},500);
	})
	
	//重载界面
	function reloadView (index) {
		//订单页指向修改
		view = index;
		
		//修改订单页类型
		$(".order_type li").eq(index).addClass("underline").siblings("li").removeClass("underline");
		
		//清空order
		$(".order").empty();

		$.ajax({
			type:"post",
			url:"/order/getallordersbyflag",
			data:{flag:view+1},
			async:true,
			success:function(data){
				if (data.flag == "200") {
					//去除提示信息
					$(".attention").hide();
					
					for (let i = 0; i < data.result.length; i++) {
						let order = data.result[i];
						console.log(order);
						
						let location = order.locationid.province + order.locationid.city + 
										order.locationid.district + order.locationid.address;
						
						//组合订单li
						let li ='<li class="order_item" oid="' + order.oid + '">\
									<div class="order_top">\
										<p class="order_date">订单时间：' + order.date + '</p>\
									</div>\
									<ul class="cart"></ul>\
									<ul class="location_info">\
										<li>\
											<h4>收货人：</h4>\
											<h4 class="location_name">' + order.locationid.shname + '</h4>\
										</li>\
										<li>\
											<h4>手机号：</h4>\
											<h4 class="location_phone">' + order.locationid.phone + '</h4>\
										</li>\
										<li>\
											<h4>收货地址：</h4>\
											<h4 class="location_address">' + location + '</h4>\
										</li>\
									</ul>\
									<div class="order_bottom">\
										<span class="order_location" >查看收货信息</span>\
										<p class="order_price">总计：￥' + order.total.toFixed(2) + '</p>\
									</div>\
								</li>';
												
						$(".order").append(li);
						
						//查看收货信息绑定事件
						$(".order .order_item").eq(i).find(".order_location").bind("click",tolocation);
																					
						//当在未付款界面时显示去付款按钮,在已发货界面时显示确认收货按钮
						if (index == 0) {
							$(".order .order_item").eq(i).find(".order_location")
								.after("<span class='order_operation'>去付款</span>");
							//绑定事件
							$(".order .order_item").eq(i).find(".order_operation").bind("click",topay);
						}else if (index == 2){
							$(".order .order_item").eq(i).find(".order_location")
								.after("<span class='order_operation'>确认收货</span>");
							//绑定事件
							$(".order .order_item").eq(i).find(".order_operation").bind("click",tofinish);
						}		
						
						//获得所有订单项
						let orderitems = order.orderitem;
						
						//遍历订单项li
						for (let j = 0; j < orderitems.length; j++) {
							let orderitem = orderitems[j];
							console.log(orderitem);
							//获取照片
							$.ajax({
								type:"get",
								url:"/goodphoto/getShowPhoto/" + orderitem.gid,
								async:true,
								success:function(photo){
									//拼接订单项li
									let itemLi ='<li class="cart_item" gid= "' + orderitem.gid + '">\
												<img src="/img/upload/' + photo + '"/>\
												<div class="item_info">\
													<h2>' + orderitem.gname + '</h2>\
													<ul class="good_size"><li><h3>' + orderitem.gsizename + '</h3></li></ul>\
													<div class="info_bottom">\
														<p class="item_price">￥' + orderitem.price.toFixed(2) + '</p>\
														<p class="item_num">x' + orderitem.number + '</p>\
													</div>\
												</div>\
											</li>';
											
									$(".order .order_item").eq(i).children(".cart").append(itemLi);
									
									//当在已收货界面时显示评价按钮
									if (index == 3) {
										$(".order .order_item").eq(i).find(".cart .cart_item").eq(j)
											.find(".info_bottom").append("<span class='item_comment'>评价</span>");
										$(".order .order_item").eq(i).find(".cart .cart_item").eq(j)
											.find(".item_comment").bind("click",tocomment);
									}
									
								},
								error:function(err){
									console.log(err);
								}
								
							});
						}
					}
				} else{
					//无数据时显示信息
					$(".attention").show();
					$(".attention .cart_empty").html("您没有" + $(".order_type").find(".underline h3").html()+"的订单");
				}
			},
			error:function(err){
				console.log(err);
			}
		});
		
		

	}
	
	//查看收货信息控制
	function tolocation (e) {
		$(e.target).html($(e.target).html() == "查看收货信息"?"收起收货信息":"查看收货信息")
					.parent().siblings(".location_info").slideToggle();
		$(e.target).parents(".order_item").siblings("li").find(".location_info").slideUp();
		$(e.target).parents(".order_item").siblings("li").find(".order_location").html("查看收货信息");
	}
	
	//去付款控制
	function topay () {
		alert("pay")
	}
	
	//确认收货控制
	function tofinish (e) {
		var oid = $(e.target).parents(".order_item").attr("oid");
		
		$.ajax({
			type:"post",
			url:"/order/updateorder",
			data:{
				otid:oid,
				flag:4,
			},
			async:true,
			success:function(data){
				reloadView(2);
			},
			error:function(err){
				console.log(err);
			}
		});
	}
	
	//评论控制
	function tocomment (e) {
		$(".com_txt form input[name=gid]").val($(this).parents(".cart_item").attr("gid"));
		$(".comment").animate({top:"0%"},500);
//		var oid = $(e.target).parents(".order_item").attr("oid");
//		
//		$.ajax({
//			type:"post",
//			url:"/order/updateorder",
//			data:{
//				otid:oid,
//				flag:3,
//			},
//			async:true,
//			success:function(data){
//				reloadView(2);
//			},
//			error:function(err){
//				console.log(err);
//			}
//		});
	}
	
});