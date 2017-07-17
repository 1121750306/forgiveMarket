$(function() {
	//判断用户是否登录
	if(sessionStorage.user != null){
		//从session中获得用户数据和购物车数据
		var user = JSON.parse(sessionStorage.getItem("user"));
		
		//请求购物车数据
		$.ajax({
			type:"get",
//			url:"/order/cart/getgoods/"+"1",
			url:"/order/cart/getgoods/"+user._id,
			async:true,
			success:function(data){
				//修改导航栏购物车商品数量
				$(".nav_cartnum").html(data.length);
				
				//判断是否已在购物车页面中
				if ($(".cart").length != 0) {
					if (data.length != 0) {
						//购物车不为空
						$(".cart").show();
					}else{
						//购物车为空
						$(".attention").show();
						$(".cart_empty").show();
					}			
				}
			},
			error:function(err){
				//设置导航栏购物车商品数量为0
				$(".nav_cartnum").html("0");
				console.log(err);
			}
		});
			
	}
	
	//打开侧滑菜单
	$(".nav_menu").click(function() {
		$(".nav").parent().css("overflow","hidden");
		$(".nav_modal").show();
		$(".nav_modal_content").animate({"right":"20%"},500);
		
		
		var goodtypes = JSON.parse(sessionStorage.getItem("goodtypes"));
		
		if (goodtypes == null) {
			//请求商品类型数据
			$.ajax({
				type:"get",
				url:"/goodtype",
				async:true,
				success:function(data){
					if (data != "error") {
						//session中存储商品类型
						sessionStorage.setItem("goodtypes", JSON.stringify(data));
						goodtypes = data;
						
						$(".nav_modal_type").empty();
						for (var i = 0; i < goodtypes.length; i++) {
							$(".nav_modal_type").append("<li><a href='/good:" +goodtypes[i]._id+ "'>" + goodtypes[i].tname + "</a></li>");
						}
					}
				},
				error:function(err){
					console.log("ERROR: get all good types fail");
					console.log("ERROR CONTENT: " + err);
				}
			});
		}else{
			
			$(".nav_modal_type").empty();
			for (var i = 0; i < goodtypes.length; i++) {
				$(".nav_modal_type").append("<li><a href='/good:" +goodtypes[i]._id+ "'>" + goodtypes[i].tname + "</a></li>");
			}
		}
		
	});
	
	//关闭侧滑菜单
    $(".nav_modal").mouseup(function (e) {
        var tar = $(this).children(".nav_modal_content");

        if (!tar.is(e.target) && (tar.has(e.target).length === 0)){
        	$(".nav_modal_content").animate({"right":"100%"},500,function(){
        		$(".nav_modal").hide();
        		$(".nav").parent().css("overflow","auto");
    		});
        }

    });
    $(".nav_modal_close").click(function(){
    	$(".nav_modal_content").animate({"right":"100%"},500,function(){
    		$(".nav_modal").hide();
			$(".nav").parent().css("overflow","auto");
    	});
    });
    
    //切换侧滑菜单页
    $(".nav_modal_tab li").click(function(){
    	$(this).css({"color":"rgba(5, 83, 33, 1)","background":"white"}).siblings("li").css({"color":"white","background":"rgba(5, 83, 33, 1)"});
    	$(".nav_modal_page").eq($(this).index()).show().siblings(".nav_modal_page").hide();
    });
    
});