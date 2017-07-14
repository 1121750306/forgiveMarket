$(function() {
	//打开侧滑菜单
	$(".nav_menu").click(function() {
		$(".nav_modal").show();
		$(".modal_content").animate({"right":"30%"},500);
	})

	//打开个人空间
	$(".nav_user").click(function() {
		self.location = "/views/user/user.html";
	})

//	//打开购物车
//	$(".nav_cart").click(function() {
//		self.location = "/order";
//	})
});