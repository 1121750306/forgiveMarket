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
			
			//当所有多选框确认时 全选框同时确认
			$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/checked.png)");
			for (var i = 0; i < itemChecks.length - 1; i++) {
				if (!itemChecks.eq(i)[0].checked && itemChecks.eq(i)[0] != $(this).parent()[0]) {
					$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/unchecked.png)");
					break;
				}
			}
			
			if ($(this).parent()[0] != $(".item_allcheck")[0]) {
				//商品总价增加当前确认的商品
				var price = parseFloat($(this).parent().parent().find(".item_price").html().substr(1));
				var num = parseFloat($(this).parent().parent().find(".item_num").val());
				var totalprice = parseFloat($(".totalprice").html().substr(4)) + price*num;
				totalprice = totalprice.toFixed(2);
				$(".totalprice").html("总价￥:" + totalprice);
				
				//结算商品数量增加
				var totalnum = $(".goodscheck").html().substr(4);
				totalnum = parseInt(totalnum.substring(0,totalnum.length - 1)) + 1;
				$(".goodscheck").html("去结算(" + totalnum + ")");
				
			}
			
			
		} else{
			//多选框已确认
			$(this).parent().css("background-image","url(../../img/innisfreeIco/unchecked.png)");
			
			//当一个多选框取消时 全选框同时取消
			if ($(this).parent()[0] != $(".item_allcheck")[0]) {
				$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/unchecked.png)");
				$(".item_allcheck").children("input")[0].checked = false;
			}
			
			if ($(this).parent()[0] != $(".item_allcheck")[0]) {
				//商品总价减少当前确认的商品
				var price = parseFloat($(this).parent().parent().find(".item_price").html().substr(1));
				var num = parseFloat($(this).parent().parent().find(".item_num").val());
				var totalprice = parseFloat($(".totalprice").html().substr(4)) - price*num;
				totalprice = totalprice.toFixed(2);
				$(".totalprice").html("总价￥:" + totalprice);
				
				//结算商品数量减少
				var totalnum = $(".goodscheck").html().substr(4);
				totalnum = parseInt(totalnum.substring(0,totalnum.length - 1)) - 1;
				$(".goodscheck").html("去结算(" + totalnum + ")");
				
			}
		}
	});
	
	//全选框控制
	$(".item_allcheck").click(function(){
		
		var allChecked = true;
		var checkBtn = $(".item_check");
		
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
										
					//商品总价增加当前确认的商品
					var price = parseFloat(checkBtn.eq(i).parent().find(".item_price").html().substr(1));
					var num = parseFloat(checkBtn.eq(i).parent().find(".item_num").val());
					var totalprice = parseFloat($(".totalprice").html().substr(4)) + price*num;
					totalprice = totalprice.toFixed(2);
					$(".totalprice").html("总价￥:" + totalprice);
					
					//结算商品数量增加
					var totalnum = $(".goodscheck").html().substr(4);
					totalnum = parseInt(totalnum.substring(0,totalnum.
						length - 1)) + 1;
					$(".goodscheck").html("去结算(" + totalnum + ")");
				}
			}
		}
		
	})

	//商品数量控制
	$(".item_add").click(function(){
		var num = $(this).parent().parent().children("input[type=text]");
		num.val((parseInt(num.val())+1)>99?99:parseInt(num.val())+1);
	});
	$(".item_sub").click(function(){
		var num = $(this).parent().parent().children("input[type=text]");
		num.val((parseInt(num.val())-1)<1?1:parseInt(num.val())-1);
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
	
})

