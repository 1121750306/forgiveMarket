$(function() {
	//打开侧滑菜单
	$(".nav_menu").click(function() {
		$(".nav_modal").show();
		$(".nav_modal_content").animate({"right":"20%"},500);
	});
	
	//关闭侧滑菜单
    $(".nav_modal").mouseup(function (e) {
        var tar = $(this).children(".nav_modal_content");

        if (!tar.is(e.target) && (tar.has(e.target).length === 0)){
        	$(".nav_modal_content").animate({"right":"100%"},500,function(){$(".nav_modal").hide()});
        }

    });
    $(".nav_modal_close").click(function(){
    	$(".nav_modal_content").animate({"right":"100%"},500,function(){$(".nav_modal").hide()});
    });
    
    //切换侧滑菜单页
    $(".nav_modal_tab li").click(function(){
    	$(this).css({"color":"rgba(5, 83, 33, 1)","background":"white"}).siblings("li").css({"color":"white","background":"rgba(5, 83, 33, 1)"});
    	$(".nav_modal_page").eq($(this).index()).show().siblings(".nav_modal_page").hide();
    });

	//打开个人空间
	$(".nav_user").click(function() {
		self.location = "/views/user/user.html";
	});

//	//打开购物车
//	$(".nav_cart").click(function() {
//		self.location = "/order";
//	});
});