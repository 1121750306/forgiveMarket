var goods = [];

$(function() {
	//	$.ajax({
	//		type:"post",
	//		url:"/order/addtocart",
	//		data:{
	//			uid:JSON.parse(sessionStorage.getItem("user"))._id,
	//			gid:"596c7fb7806c5204cc6a0b04",
	//			gsids:JSON.stringify(["596c8155693f4621c0da48e0", "596c8155693f4621c0da48e1"]),
	//			num: "2"
	//		},
	//		async:true,
	//		success:function(result){
	//			console.log(result);
	//		},
	//		error:function(err){
	//			console.log(err);
	//		}
	//	});
	//排序方式控制
	$(".goodorder").click(function() {
		$(".orderby").slideToggle(300);
	});
	$(".orderby li").click(function() {
		$(this).css("color", "rgba(5, 83, 33, 1)").siblings("li").css("color", "grey");
		$(".goodorder").html($(this).html().substr(1));
		$(".orderby").slideUp();
	});
	
	//按销量排序
	$(".orderbysale").click(function(){
		$(".orderby").attr("order","sales");
		
		goods.sort(reverse());
		
		//重载界面
		reloadView();
	})
	
	//按价格排序
	$(".orderbyprice").click(function(){
		$(".orderby").attr("order","price");
		
		goods.sort(reverse());
		
		//重载界面
		reloadView();
	})

	//正逆序控制
	$(".orientation").click(function() {
		var orientation = $(this).html();
		$(this).html(orientation == "从小到大"?"从大到小":"从小到大").attr("order", orientation == "从小到大"?"-1":"1");
		
		goods.sort(reverse());
		
		//重载界面
		reloadView();
	});

	//搜索按钮显示控制
	$(".search input").focus(function() {
		$(".search").animate({
			"width": "80%"
		}, function() {
			$(".banner h2").show();
		});

	});
	$(".search input").blur(function() {
		$(".banner h2").hide();
		$(".search").animate({
			"width": "96%"
		});
	});
	
	//商品页面跳转控制
	$(".cart").on("mouseup", ".cart_item", function(e){
    	var gid = $(this).attr("gid");
    	
		location.assign("/views/goodInfo/goodInfo.html?gid=" + gid);
	})

	//设置搜索内容
	var searchContent = window.location.search;
	console.log("searchContent:" + searchContent);
	if(searchContent != null && searchContent != "") {
		var content = searchContent.substring(searchContent.indexOf("=") + 1, searchContent.length);
		console.log("content:" + content);
		content = decodeURI(content);
		if(searchContent != null && searchContent != "") {
			$("#search_content").val(content);
			search();
		}
	}
	
	//排序
	function reverse() {
		var i = parseInt($(".orientation").attr("order"));
		var n = $(".orderby").attr("order");
		
	    return function (q, w) {
	        var a = parseFloat(q[n]);
	        var b = parseFloat(w[n]);
	
	        return i*(a - b)
	    };
	}
	
	//重载内容
	function reloadView () {
		//清空
		$(".cart").empty();	
		
		//遍历所有商品
		for (var i = 0; i < goods.length; i++) {
			var good = goods[i];
			
			//组合li
			let li ='<li class="cart_item" gid="' + good.gid + '">\
						<img src="/img/upload/' + good.photo + '"/>\
						<div class="item_info">\
							<h2>' + good.gname + '</h2>\
							<ul class="good_size">' + good.goodsizeUl + '</ul>\
							<div class="info_bottom">\
								<p class="item_price">￥' + good.price + '</p>\
								<p class="item_num">' + good.sales + '人付款</p>\
							</div>\
						</div>\
					</li>';
					
			$(".cart").append(li);	
		}
	}
	
})

//搜索控制
function search() {
	var content = $("#search_content").val();
	$.ajax({
		type: "post",
		url: "/users/searchgood",
		data: {
			content: content
		},
		async: true,
		success: function(data) {
			var items = data.result;
			for (let i = 0; i < items.length; i++) {
				let gid = items[i].gid;
				let gname = items[i].gname;
				let price = (items[i].price*items[i].discount).toFixed(2);
				
				//获取照片
				$.ajax({
					type:"get",
					url:"/goodphoto/getShowPhoto/" + gid,
					async:true,
					success:function(photo){
						//获取商品规格
						$.ajax({
							type:"post",
							url:"/good/queryGoodSizeByid",
							data:{id:gid},
							async:true,
							success:function(goodsizes){
								
								//遍历商品规格
								let goodsizeUl = "";
								for (let j = 0; j < goodsizes.length; j++) {
									//拼接商品规格
									goodsizeUl = goodsizeUl + "<li><h3>" + goodsizes[j].gsname +"</h3></li>";
								}
								
								//获取销量
								$.ajax({
									type:"get",
									url:"/good/getGoodSales/" + gid,
									async:true,
									success:function(sales){
										
										var item = {gid:gid, gname:gname, goodsizeUl:goodsizeUl, price:price, sales:sales, photo:photo};
										goods.push(item);
										
										//组合li
										let li ='<li class="cart_item" gid="' + gid + '">\
													<img src="/img/upload/' + photo + '"/>\
													<div class="item_info">\
														<h2>' + gname + '</h2>\
														<ul class="good_size">' + goodsizeUl + '</ul>\
														<div class="info_bottom">\
															<p class="item_price">￥' + price + '</p>\
															<p class="item_num">' + sales + '人付款</p>\
														</div>\
													</div>\
												</li>';
												
										$(".cart").append(li);	
									},
									error:function(err){
										console.log(err);
									}
								});
							},
							error:function(err){
								console.log(err);
							}
						});
					},
					error:function(err){
						console.log(err);
					}
				});
			}
				
		}
	});
}

////i>0从小到大,n对象属性
//function reverse(i, n) {
//  return function (q, w) {
//      //			console.log(parseInt(q[n]))
//      var a = parseInt(q[n]);
//      var b = parseInt(w[n]);
//      console.log(a + "-" + b)
//
//      return i*(a - b)
//  };
//}
