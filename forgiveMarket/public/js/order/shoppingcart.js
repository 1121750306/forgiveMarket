$(function(){
	//判断用户是否登录
	if(sessionStorage.user == null){
		showLogin();
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
				//商品总价增加当前勾选的商品
				var price = parseFloat($(this).parent().parent().find(".item_price").html().substr(1));
				var num = parseFloat($(this).parent().parent().find(".item_num").val());
				var totalprice = parseFloat($(".totalprice").html().substr(4)) + price*num;
				totalprice = totalprice.toFixed(2);
				$(".totalprice").html("总价￥:" + totalprice);
				
				//结算商品数量增加
				var totalnum = $(".goodscheck").html().substr(4);
				totalnum = parseInt(totalnum.substring(0,totalnum.length - 1)) + num;
				$(".goodscheck").html("去结算(" + totalnum + ")");
				
			}
			
			
		} else{
			//多选框已确认
			$(this).parent().css("background-image","url(../../img/innisfreeIco/unchecked.png)");
			
			//当有一个多选框确认时 删除按钮显示
			$(".check_delete").hide();
			for (var i = 0; i < itemChecks.length - 1; i++) {
				if (itemChecks.eq(i)[0].checked && itemChecks.eq(i)[0] != $(this).parent()[0]) {
					console.log(i);
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
				//商品总价减少当前勾选的商品
				var price = parseFloat($(this).parent().parent().find(".item_price").html().substr(1));
				var num = parseFloat($(this).parent().parent().find(".item_num").val());
				var totalprice = parseFloat($(".totalprice").html().substr(4)) - price*num;
				totalprice = totalprice.toFixed(2);
				$(".totalprice").html("总价￥:" + totalprice);
				
				//结算商品数量减少
				var totalnum = $(".goodscheck").html().substr(4);
				totalnum = parseInt(totalnum.substring(0,totalnum.length - 1)) - num;
				$(".goodscheck").html("去结算(" + totalnum + ")");
				
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
										
					//商品总价增加当前勾选的商品
					var price = parseFloat(checkBtn.eq(i).parent().find(".item_price").html().substr(1));
					var num = parseFloat(checkBtn.eq(i).parent().find(".item_num").val());
					var totalprice = parseFloat($(".totalprice").html().substr(4)) + price*num;
					totalprice = totalprice.toFixed(2);
					$(".totalprice").html("总价￥:" + totalprice);
					
					//结算商品数量增加
					var totalnum = $(".goodscheck").html().substr(4);
					totalnum = parseInt(totalnum.substring(0,totalnum.
						length - 1)) + num;
					$(".goodscheck").html("去结算(" + totalnum + ")");
				}
			}
		}
		
	})

	//商品数量控制
	$(".item_add").click(function(){
		var item = $(this).parents(".cart_item");
		var num = parseInt(item.find(".item_num").val());
		
		//商品数量小于99时可增加
		if (num < 99) {
			item.find(".item_num").val(num + 1);
			
			//如果商品已被勾选
			if (item.find(".item_check input")[0].checked) {
				//商品总价增加一个当前勾选的商品
				var price = parseFloat(item.find(".item_price").html().substr(1));
				var totalprice = parseFloat($(".totalprice").html().substr(4)) + price;
				totalprice = totalprice.toFixed(2);
				$(".totalprice").html("总价￥:" + totalprice);
			
				//结算商品数量增加
				var totalnum = $(".goodscheck").html().substr(4);
				totalnum = parseInt(totalnum.substring(0,totalnum.
					length - 1)) + 1;
				$(".goodscheck").html("去结算(" + totalnum + ")");
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
				//商品总价减少一个当前勾选的商品
				var price = parseFloat(item.find(".item_price").html().substr(1));
				var totalprice = parseFloat($(".totalprice").html().substr(4)) - price;
				totalprice = totalprice.toFixed(2);
				$(".totalprice").html("总价￥:" + totalprice);
			
				//结算商品数量减少
				var totalnum = $(".goodscheck").html().substr(4);
				totalnum = parseInt(totalnum.substring(0,totalnum.
					length - 1)) - 1;
				$(".goodscheck").html("去结算(" + totalnum + ")");
			}
		}
				
	});
	$(".info_bottom").children("input[type=text]").keydown(function(){
		if (event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39 && (event.keyCode > 57 || event.keyCode < 48)) {
			event.preventDefault();
		}
	});
	$(".info_bottom").children("input[type=text]").keyup(function(){
		var num = parseInt($(this).val());
		if (num < 1) {
			$(this).val(1);
		} else if (num > 99) {
			$(this).val(99);
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
				item.eq(i).remove();
			}
		}
		
		//全选框取消确认
		$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/unchecked.png)");
		$(".item_allcheck input")[0].checked = false;
							
		//商品总价和数量归0
		$(".totalprice").html("总价￥:0.00");
		$(".goodscheck").html("去结算(0)");
		
		//删除按钮消失
		$(this).hide();
		
	});
	
})

