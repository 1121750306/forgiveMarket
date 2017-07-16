$(function(){
	//判断用户是否登录
	if(sessionStorage.user == null || sessionStorage.user == "null" || sessionStorage.user == undefined){
		//提示框显示
		$(".attention").show();
		$(".no_login").show();
		
		//弹出登录框
		showLogin();
		
	}else{
		
		var cartgoods = JSON.parse(sessionStorage.getItem("cartgoods"));
		
		//判断是否获取过购物车数据
		if (cartgoods == null) {
			//请求购物车数据
			$.ajax({
				type:"get",
				url:"/order/cart/getgoods/"+"1",
	//			url:"/order/cart/getgoods/"+user._id,
				async:true,
				success:function(data){
					if (data.length != 0) {
						//购物车不为空
						$(".cart").show();
					}else{
						//购物车为空
						$(".attention").show();
						$(".cart_empty").show();
					}
				},
				error:function(err){
					console.log(err);
				}
			});
			
		}else{
			
			if (cartgoods.length != 0) {
				//购物车不为空
				$(".cart").show();
			}else{
				//购物车为空
				$(".attention").show();
				$(".cart_empty").show();
			}
		}
		
	}
	addOnLoginListener(function(err, result){
		if (!err) {
			dismissLogin();
			location.reload();
			console.log(result);
		}else{
			console.log(err);
		}
	});
	
	//搜索按钮显示控制
	$(".cart_search input").focus(function(){
		$(".cart_search").animate({"width":"80%"},function(){
			$(".banner h2").show();
		});
		
	});
	$(".cart_search input").blur(function(){
		$(".banner h2").hide();
		$(".cart_search").animate({"width":"96%"});
	});
	
	//多选框控制
	$(".item_check").children("input").on("change",function(){
		
		var itemChecks = $(".item_check").children("input");
		
		if($(this)[0].checked){
			//多选框未确认
			$(this).parent().css("background-image","url(../../img/innisfreeIco/checked.png)");
			
			//删除按钮显示
			$(".check_delete").show();
			
			//当所有多选框确认时 全选框同时确认
			$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/checked.png)");
			for (var i = 0; i < itemChecks.length - 1; i++) {
				if (!itemChecks.eq(i)[0].checked && itemChecks.eq(i)[0] != $(this).parent()[0]) {
					$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/unchecked.png)");
					break;
				}
			}
			
			if ($(this).parent()[0] != $(".item_allcheck")[0]) {
				
				var price = parseFloat($(this).parent().parent().find(".item_price").html().substr(1));
				var num = parseFloat($(this).parent().parent().find(".item_num").val());
					
				//结算商品价格和数量增加当前勾选的商品
				countChange(price, num);
				
			}
			
			
		} else{
			//多选框已确认
			$(this).parent().css("background-image","url(../../img/innisfreeIco/unchecked.png)");
			
			//当有一个多选框确认时 删除按钮显示
			$(".check_delete").hide();
			for (var i = 0; i < itemChecks.length - 1; i++) {
				if (itemChecks.eq(i)[0].checked && itemChecks.eq(i)[0] != $(this).parent()[0]) {
					$(".check_delete").show();
					break;
				}
			}
			
			//当一个多选框取消时 全选框同时取消
			if ($(this).parent()[0] != $(".item_allcheck")[0]) {
				$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/unchecked.png)");
				$(".item_allcheck").children("input")[0].checked = false;
			}
			
			if ($(this).parent()[0] != $(".item_allcheck")[0]) {

				var price = parseFloat($(this).parent().parent().find(".item_price").html().substr(1));
				var num = parseFloat($(this).parent().parent().find(".item_num").val());
					
				//结算商品价格和数量减少当前勾选的商品
				countChange(price, -num);
				
			}
		}
	});
	
	//全选框控制
	$(".item_allcheck").click(function(){
		
		var allChecked = true;
		var checkBtn = $(".item_check");
		
		//购物车为空
		if (checkBtn.length <= 1) {
			$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/unchecked.png)");
			$(".item_allcheck input")[0].checked = false;
		}
		
		//判断是否已经全选
		for (var i = 0; i < checkBtn.length - 1; i++) {
			if (!checkBtn.eq(i).children("input")[0].checked) {
				allChecked = false;
				break;
			}
		}
		
		if (allChecked) {
			//已全选
			for (var i = 0; i < checkBtn.length - 1; i++) {
				checkBtn.eq(i).css("background-image","url(../../img/innisfreeIco/unchecked.png)");
				checkBtn.eq(i).children("input")[0].checked = !checkBtn.eq(i).children("input")[0].checked ;
				
				//商品总价和数量归0
				$(".totalprice").html("总价￥:0.00");
				$(".goodscheck").html("去结算(0)");
			}
			
		}else{
			//未全选
			for (var i = 0; i < checkBtn.length - 1; i++) {
				if (!checkBtn.eq(i).children("input")[0].checked) {
					checkBtn.eq(i).css("background-image","url(../../img/innisfreeIco/checked.png)");
					checkBtn.eq(i).children("input")[0].checked = true;
										
					var price = parseFloat(checkBtn.eq(i).parent().find(".item_price").html().substr(1));
					var num = parseFloat(checkBtn.eq(i).parent().find(".item_num").val());
					
					//结算商品价格和数量增加当前勾选的商品
					countChange(price, num);
				}
			}
		}
		
	})

	//商品数量加减控制
	$(".item_add").click(function(){
		var item = $(this).parents(".cart_item");
		var num = parseInt(item.find(".item_num").val());
		
		//商品数量小于99时可增加
		if (num < 99) {
			item.find(".item_num").val(num + 1);
			
			//如果商品已被勾选
			if (item.find(".item_check input")[0].checked) {
				
				var price = parseFloat(item.find(".item_price").html().substr(1));
				
				//结算商品价格和数量增加一个当前勾选的商品
				countChange(price, 1);
			}
		}
	});
	$(".item_sub").click(function(){
		var item = $(this).parents(".cart_item");
		var num = parseInt(item.find(".item_num").val());
		
		//商品数量大于1时可减少
		if (num > 1) {
			item.find(".item_num").val(num - 1);
			
			//如果商品已被勾选
			if (item.find(".item_check input")[0].checked) {

				var price = parseFloat(item.find(".item_price").html().substr(1));
				
				//结算商品价格和数量减少一个当前勾选的商品
				countChange(price, -1);
			}
		}
				
	});
	
	//商品数量输入控制
	var originnum;
	$(".info_bottom").children("input[type=text]").keydown(function(){
		originnum = parseInt($(this).val());
		if (isNaN(originnum)) {
			originnum = 1;
		}
		if (event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39 && (event.keyCode > 57 || event.keyCode < 48)) {
			event.preventDefault();
		}
	});
	$(".info_bottom").children("input[type=text]").keyup(function(){
		var item = $(this).parents(".cart_item");
		var num = parseInt($(this).val());
		if (isNaN(num)) {
			num = 1;
			$(this).val("");
		}else{
			if (num < 1) {
				num = 1;
			} else if (num > 99) {
				num = 99;
			}
			$(this).val(num);
		}
		
		//如果商品已被勾选
		if (item.find(".item_check input")[0].checked) {
			
			var price = parseFloat(item.find(".item_price").html().substr(1));
			
			//结算商品价格和数量改变
			countChange(price, num - originnum)
		}
	});
	$(".info_bottom").children("input[type=text]").blur(function(){
		if ($(this).val() == "") {
			$(this).val(1);
		}
	});
	
	//删除选中控制
	$(".check_delete").click(function(){
		var item = $(".cart_item");
		
		//遍历所有被勾选的商品
		for (var i = 0; i < item.length; i++) {
			if (item.eq(i).find(".item_check input")[0].checked) {
				//导航栏购物车商品数量减少
				var num = parseInt($(".nav_cartnum").html());
				$(".nav_cartnum").html(num - 1);
				
				//商品列移除
				item.eq(i).remove();
			}
		}
		
		//全选框取消确认
		$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/unchecked.png)");
		$(".item_allcheck input")[0].checked = false;
							
		//商品总价和数量归0
		$(".totalprice").html("总价￥:0.00");
		$(".goodscheck").html("去结算(0)");
		
		//删除后购物车为空时提示框显示
		if($(".cart_item").length == 0){
			$(".cart").hide();
			$(".attention").show();
			$(".cart_empty").show();
		}
		
		//购物车数据session销毁需要重新请求
		sessionStorage.removeItem("cartgoods");
		
		//删除按钮消失
		$(this).hide();
		
	});
	
	//请登录按钮控制
	$(".no_login").click(function(){
		showLogin();
	});
	
	//改变结算商品信息
	function countChange (price, num) {
		//结算商品价格改变
		var totalprice = parseFloat($(".totalprice").html().substr(4)) + price*num;
		totalprice = totalprice.toFixed(2);
		$(".totalprice").html("总价￥:" + totalprice);
	
		//结算商品数量改变
		var totalnum = $(".goodscheck").html().substr(4);
		totalnum = parseInt(totalnum.substring(0,totalnum.length - 1)) + num;
		$(".goodscheck").html("去结算(" + totalnum + ")");
	}
	
})

