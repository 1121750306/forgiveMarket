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
	
	//查看收货信息控制
	$(".order_location").click(function(){
		$(".order").empty();
		reloadView(view);
	});
	
	//商品评论控制
	$(".item_comment").click(function(){
		$(".com_txt form input[name=gid]").val($(this).parents(".cart_item").attr("gid"));
		$(".comment").animate({top:"0%"},500);
	});
	$(".com_cancel").click(function(){
		$(".comment").animate({top:"100%"},500);
	})
	
	//重载界面
	function reloadView (index) {
		//订单页指向修改
		view = index;
		
		//修改订单页类型
		$(".order_type li").eq(index).addClass("underline").siblings("li").removeClass("underline");
		
		//当在已收货界面时显示评价按钮
		$(".item_comment").remove();
		if (index == 3) {
			$(".info_bottom").append("<span class='item_comment'>评价</span>");
			$(".item_comment").bind("click",tocomment);
		}
		
		//当在未付款界面时显示去付款按钮,在已发货界面时显示确认收货按钮
		$(".order_operation").remove();
		if (index == 0) {
			$(".order_location").after("<span class='order_operation'>去付款</span>");
			$(".order_operation").bind("click",topay);
		}else if (index == 2){
			$(".order_location").after("<span class='order_operation'>确认收货</span>");
			$(".order_operation").bind("click",tofinish);
		}
		
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
						
						//组合订单li
						let li ='<li class="order_item" oid="' + order.gid + '">\
									<div class="order_top">\
										<p class="order_date">订单时间：' + order.date + '</p>\
									</div>\
									<ul class="cart"></ul>\
									<div class="order_bottom">\
										<span class="order_location" >查看收货信息</span>\
										<p class="order_price">总计：￥' + order.total.toFixed(2) + '</p>\
									</div>\
								</li>';
						
						$(".order").append(li);
						
						//获得所有订单项
						let orderitems = order.orderitem;
						
						//拼接订单项li
						let itemLi = "";
						for (let j = 0; j < orderitems.length; j++) {
							let orderitem = orderitems[j];
							console.log(orderitem);
							//获取照片
							$.ajax({
								type:"get",
								url:"/goodphoto/getShowPhoto/" + orderitem.gid,
								async:true,
								success:function(photo){
									itemLi +='<li class="cart_item" gid= "' + orderitem.gid + '">\
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
	
	//去付款控制
	function topay () {
		alert("pay")
	}
	
	//确认收货控制
	function tofinish () {
		alert("finish")
	}
	
	//评论控制
	function tocomment () {
		alert("comment")
	}
	
});