$(function() {
	
	$(".order_type li").click(function(){
		$(this).addClass("underline").siblings("li").removeClass("underline");
		switch ($(this).index()){
			//未付款
			case 0:
				console.log("未付款");
				reloadView()
				break;
			//已付款
			case 1:
				console.log("已付款");
				break;
			//已发货
			case 2:
				console.log("已发货");
				break;
			//已收货
			case 3:
				console.log("已收货");
				break;
			//已完成
			case 4:
				console.log("已完成");
				break;
			default:
				break;
		}
	});
	
	//重载界面
	function reloadView () {
		
	}
	
});