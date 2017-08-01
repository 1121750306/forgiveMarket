$(function(){
	//判断用户是否登录
	if(sessionStorage.user == null){
		//提示框显示
		$(".attention").show();
		$(".no_login").show();
		
		//弹出登录框
		showLogin();
		
	}else {
		//从session中获得用户数据
		var user = JSON.parse(sessionStorage.getItem("user"));
		
		//加载白幕控制
		var loading = 0;
		loadstart();
		
		//请求购物车数据
		$.ajax({
			type:"get",
			url:"/order/getorderitembyuser/" + user._id + "/0",
			async:true,
			success:function(result){
				if (result.type == "success") {
					var goods = result.message;
					//修改导航栏购物车商品数量
					$(".nav_cartnum").html(goods.length);
					
					if (goods.length != 0) {
						//购物车不为空
						$(".cart").show();
						
						loading = goods.length;
						
						//遍历商品列表
						for (var i = 0; i < goods.length; i++) {
							(function (i) {
								var good = goods[i];
							
								//获取照片
								$.ajax({
									type:"get",
									url:"/goodphoto/getShowPhoto/" + good.gid,
									async:true,
									success:function(photo){
										//拼接商品规格
										var goodsizeUl = "";
										for (var j = 0; j < good.gsizes.length; j++) {
											goodsizeUl = goodsizeUl + "<li><h3>" + good.gsizes[j] +"</h3></li>";
										}
										
										//组合li
										var li ='<li class="cart_item" gid="' + good.gid + '" otid="' + good.otid + '">\
													<div class="item_check">\
														<input type="checkbox" />\
													</div>\
													<img src="/img/upload/' + photo + '"/>\
													<div class="item_info">\
														<h2>' + good.gname + '</h2>\
														<ul class="good_size">' + goodsizeUl + '</ul>\
														<div class="info_bottom">\
															<p class="item_price">￥' + good.price + '</p>\
															<div class="num_ctrl">\
																<span><i class="item_sub"></i></span>\
																<input class="item_num" type="text" value="' + good.num + '"/>\
																<span><i class="item_add"></i></span>\
															</div>\
														</div>\
													</div>\
												</li>';
												
										$(".cart").append(li);
										
										loading--;
										if (loading == 0) {
											//加载成功
											loadcomplete();
										}
										
									},
									error:function(err){
										//加载失败
										loadfail();
										console.log(err);
									}
								});
							
							})(i);		
						
						}
						
					}else{
						//购物车为空
						//加载成功
						loadcomplete();
						
						$(".attention").show();
						$(".cart_empty").show();
					}
					
				}else {
					//加载失败
					loadfail();
					console.log(result.message);
				}
				
			},
			error:function(err){
				//加载失败
				loadfail();
				console.log(err);
			}
		});
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
	
	//多选框控制
	$(".cart").on("change", ".item_check input", function(){
		
		var itemChecks = $(".item_check").children("input");
		
		if($(this)[0].checked){
			//多选框未确认
			$(this).parent().css("background-image","url(../../img/innisfreeIco/checked.png)");
			
			//删除按钮显示
			$(".check_delete").show();
			
			//当所有多选框确认时 全选框同时确认
			$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/checked.png)");
			$(".item_allcheck")[0].checked = true;
			for (var i = 0; i < itemChecks.length - 1; i++) {
				if (!itemChecks.eq(i)[0].checked && itemChecks.eq(i)[0] != $(this).parent()[0]) {
					$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/unchecked.png)");
					$(".item_allcheck")[0].checked = false;
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
	$(".item_allcheck").children("input").on("change", function(){
		
		var itemChecks = $(".item_check").children("input");
		
		if($(this)[0].checked){
			//多选框未确认
			$(this).parent().css("background-image","url(../../img/innisfreeIco/checked.png)");
			
			//删除按钮显示
			$(".check_delete").show();
			
//			//当所有多选框确认时 全选框同时确认
//			$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/checked.png)");
//			$(".item_allcheck")[0].checked = true;
//			for (var i = 0; i < itemChecks.length - 1; i++) {
//				if (!itemChecks.eq(i)[0].checked && itemChecks.eq(i)[0] != $(this).parent()[0]) {
//					$(".item_allcheck").css("background-image","url(../../img/innisfreeIco/unchecked.png)");
//					$(".item_allcheck")[0].checked = false;
//					break;
//				}
//			}
			
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
				$(".item_allcheck").children("input")[0].checked = false;
				
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
		
	});

	//商品数量加减控制
	$(".cart").on("click", ".item_add", function(){
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
	$(".cart").on("click", ".item_sub", function(){
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
	$(".cart").on("keydown", ".info_bottom input[type=text]", function(){
		originnum = parseInt($(this).val());
		if (isNaN(originnum)) {
			originnum = 1;
		}
		if (event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39 && (event.keyCode > 57 || event.keyCode < 48)) {
			event.preventDefault();
		}
	});
	$(".cart").on("keyup", ".info_bottom input[type=text]", function(){
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
	$(".cart").on("blur", ".info_bottom input[type=text]", function(){
		if ($(this).val() == "") {
			$(this).val(1);
		}
	});
	
	//商品页面跳转控制
	$(".cart").on("mouseup", ".cart_item", function(e){
		var tar = [];
		tar.push($(this).children(".item_check"));
		tar.push($(this).find(".num_ctrl"));
		
		for(var i = 0; i < tar.length; i++){
            if (tar[i].is(e.target) || !(tar[i].has(e.target).length === 0)){
                break;
            }
        }

        if (i == tar.length){
        	var gid = $(this).attr("gid");
        	
			location.assign("/views/goodInfo/goodInfo.html?gid=" + gid);
		}

	})
	
	//删除选中控制
	$(".check_delete").click(function(){
		var item = $(".cart_item");
		
		//遍历所有被勾选的商品
		for (var i = 0; i < item.length; i++) {
			if (item.eq(i).find(".item_check input")[0].checked) {
				//获得订单项id
				var otid = item.eq(i).attr("otid");
				
				//删除订单项数据
				$.ajax({
					type:"get",
					url:"/order/deleteorderitembyid/" + otid,
					async:true,
					success:function(result){
						if (result.type == "success") {
							toast("删除成功");
						}else{
							toast("删除失败", "/views/order/cart.html");
						}
					},
					error:function(err){
						toast("删除失败", "/views/order/cart.html");
					}
				});
				
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
		
		//删除按钮消失
		$(this).hide();
		
	});
	
	//结算控制
	$(".goodscheck").click(function(){
		var item = $(".cart_item");
		var url = "";
		//是否有已勾选的商品
		var exist = false;
		
		//遍历所有被勾选的商品
		for (var i = 0; i < item.length; i++) {
			if (item.eq(i).find(".item_check input")[0].checked) {
				//获得otid
				var otid = item.eq(i).attr("otid");
				var num = parseInt(item.eq(i).find(".item_num").val());
				
				//拼接url
				if (url == "") {
					url = url + "?otids=" + otid;
				}else {
					url = url + "&" + otid;
				}
				
				//提交勾选订单项数据
				$.ajax({
					type:"post",
					url:"/order/updateorderitem",
					data:{
						otid:otid,
						num:num
					},
					async:true,
					success:function(result){
						console.log(result.type);
					},
					error:function(err){
						console.log(err);
					}
				});
				
				//有已勾选的商品
				exist = true;
			}
		}
		
		if (exist) {
			location.assign("/views/order/pay.html" + url);
		}
		
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

