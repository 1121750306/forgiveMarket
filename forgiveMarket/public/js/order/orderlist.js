$(function() {
	//获取url中订单页指向
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
		
		//当在已发货界面时显示评价按钮
		if (index == 3) {
			$(".item_comment").show();
		}else {
			$(".item_comment").hide();
		}
		
		//清空order
//		$(".order").empty();
		
		//无数据时显示信息
		if ($(".order").html() == "") {
			console.log("empty")
			$(".attention").show();
			$(".attention .cart_empty").html("您没有" + $(".order_type").find(".underline h3").html()+"的订单");
		}else {
			$(".attention").hide();
		}
		
//		switch (index){
//			//未付款
//			case 0:
//				console.log("未付款");
//				break;
//			//已付款
//			case 1:
//				console.log("已付款");
//				break;
//			//已发货
//			case 2:
//				console.log("已发货");
//				break;
//			//已收货
//			case 3:
//				console.log("已收货");
//				break;
//			//已完成
//			case 4:
//				console.log("已完成");
//				break;
//			default:
//				break;
//		}

	}
	
});