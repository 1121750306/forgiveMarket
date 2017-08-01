$(function() {
	//获取url中订单页指向， 0.未付款 1.已付款 2.已发货 3.已收货 4.已完成
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
	
	//商品评论控制
	$(".com_submit").click(function(){
		var formdata=new FormData();
		var otid = $(".comment").attr("otid");
		var gid = $(".com_txt input[name=gid]").val();
		var content = $(".com_txt textarea").val();
		var imgNum=0;	    
		for(var i=0;i<$(".compic li img").length;i++){
		      if($(".compic li input")[i].files[0]!=undefined){
		      	  imgNum++;
		      	 console.log("==="+$(".compic li input")[i].files[0]);
			     formdata.append("photo"+i,$(".compic li input")[i].files[0]);
		      }  
		}
		formdata.append("gid",gid);
		formdata.append("otid",otid);
		formdata.append("imgNum",imgNum);
		formdata.append("content",content);
		//添加评论
		$.ajax({
			type:"post",
			url:"/comment/addComment",
			data:formdata,
			// 告诉jQuery不要去处理发送的数据
			processData: false,
			// 告诉jQuery不要去设置Content-Type请求头
			contentType: false,
			async:true,
			success:function(data){
				$(".compic li").each(function(index){
					console.log("index==="+index);
				if(index!=0){
		     			$(".compic li").eq(index).remove();
		     	}else{  		
		     		$(".compic li").eq(index).find("input").val("");
		     		$(".compic li").eq(index).find("img").attr('src','');
		     		$(".compic li").eq(index).find("img").css('display','none');
		     	    $(".compic li").eq(index).find("div").css('display','none');
     		
            	}
     
				})
				var oid = $(".comment").attr("oid");
				
				if (oid) {
					//订单内的其他订单项都已评论，将订单加入已完成订单表中
					$.ajax({
						type:"post",
						url:"/order/updateorder",
						data:{
							otid:oid,
							flag:5,
						},
						async:true,
						success:function(data){
							$(".comment").animate({top:"100%"},500,function(){
								reloadView(3);
							});
						},
						error:function(err){
							console.log(err);
						}
					});
					
				}else{
					//订单中存在未评论的订单项
					$(".comment").animate({top:"100%"},500,function(){
						reloadView(3);
					});
				}
				
			},
			error:function(err){
				console.log(err);
			}
		});
		
		//页面锁定取消
		$("body").css("overflow", "auto");
		
	})
	$(".com_cancel").click(function(){
		$(".comment").attr("oid","");
		$(".comment").attr("otid","");
		$(".comment").animate({top:"100%"},500);
		
		//页面锁定取消
		$("body").css("overflow", "auto");
	})
	
	//重载界面
	function reloadView (index) {
		//订单页指向修改
		view = index;
		
		//显示加载白页
		$(".loading").show();
		
		//修改订单页类型
		$(".order_type li").eq(index).addClass("underline").siblings("li").removeClass("underline");
		
		//清空order
		$(".order").empty();
		
		//评论oid,otid删除
		$(".comment").attr("oid","");
		$(".comment").attr("otid","");
		
		$.ajax({
			type:"post",
			url:"/order/getallordersbyflag",
			data:{flag:view+1},
			async:true,
			success:function(data){
				if (data.flag == "200") {
					//去除加载白页
					$(".loading").hide();
					
					//去除提示信息
					$(".attention").hide();
					
					//记录需要请求的照片总量
					var photos = {num:0, detail:[]};
					
					for (var i = 0; i < data.result.length; i++) {
						var order = data.result[i];
						
						//拼接收货地址信息
						var location = order.locationid.province + order.locationid.city + 
										order.locationid.district + order.locationid.address;
						
						//组合订单li
						var li ='<li class="order_item" oid="' + order.oid + '">\
									<div class="order_top">\
										<p class="order_date">订单时间：' + order.date + '</p>\
									</div>\
									<ul class="cart"></ul>\
									<ul class="location_info">\
										<li>\
											<h3>收货人：</h3>\
											<h3 class="location_name">' + order.locationid.shname + '</h3>\
										</li>\
										<li>\
											<h3>手机号：</h3>\
											<h3 class="location_phone">' + order.locationid.phone + '</h3>\
										</li>\
										<li>\
											<h3>收货地址：</h3>\
											<h3 class="location_address">' + location + '</h3>\
										</li>\
									</ul>\
									<div class="order_bottom">\
										<span class="order_location" >查看收货信息</span>\
										<p class="order_price">总计：￥' + order.total.toFixed(2) + '</p>\
									</div>\
								</li>';
												
						$(".order").append(li);
						
						//查看收货信息绑定事件
						$(".order .order_item").eq(i).find(".order_location").bind("click",tolocation);
																					
						//当在未付款界面时显示去付款按钮,在已发货界面时显示确认收货按钮
						if (index == 0) {
							$(".order .order_item").eq(i).find(".order_location")
								.after("<span class='order_operation'>去付款</span>");
							//绑定事件
							$(".order .order_item").eq(i).find(".order_operation").bind("click",topay);
						}else if (index == 2){
							$(".order .order_item").eq(i).find(".order_location")
								.after("<span class='order_operation'>确认收货</span>");
							//绑定事件
							$(".order .order_item").eq(i).find(".order_operation").bind("click",tofinish);
						}		
						
						//获得所有订单项
						var orderitems = order.orderitem;
						
						//遍历订单项li
						for (var j = 0; j < orderitems.length; j++) {
							var orderitem = orderitems[j];
							console.log(orderitem);
							//拼接订单项li
							var itemLi ='<li class="cart_item" gid= "' + orderitem.gid + '" otid="' + orderitem.otid + '">\
											<div class="item_top">\
												<img src=""/>\
												<div class="item_info">\
													<h2>' + orderitem.gname + '</h2>\
													<ul class="good_size"><li><h3>' + orderitem.gsizename + '</h3></li></ul>\
													<div class="info_bottom">\
														<p class="item_price">￥' + orderitem.price.toFixed(2) + '</p>\
														<p class="item_num">x' + orderitem.number + '</p>\
													</div>\
												</div>\
											</div>\
										</li>';
									
							$(".order .order_item").eq(i).children(".cart").append(itemLi);
							
							$(".order .order_item").eq(i).find(".cart .cart_item").eq(j).bind("mouseup",togoodinfo);
							
							//当在已收货和已完成界面时显示评价控制按钮
							if (index == 3 || index == 4) {
								if (!orderitem.cid) {
									//未评价
									$(".order .order_item").eq(i).find(".cart .cart_item").eq(j)
										.find(".info_bottom").append("<span class='item_comment'>评价</span>");
									//绑定事件
									$(".order .order_item").eq(i).find(".cart .cart_item").eq(j)
										.find(".item_comment").bind("click",tocomment);
										
								} else{
									//已评价
									$(".order .order_item").eq(i).find(".cart .cart_item").eq(j)
										.find(".info_bottom").append("<span class='item_comment'>查看评价</span>");
									//绑定事件
									$(".order .order_item").eq(i).find(".cart .cart_item").eq(j)
										.find(".item_comment").bind("click",toviewcomment);
										
									//评论详情
									$(".order .order_item").eq(i).find(".cart .cart_item").eq(j).append('\
											<div class="item_bottom">\
												<h3 class="comment_info">' + orderitem.cid.content + '</h3>\
												<ul class="comment_photo"></ul>\
												<h3 class="comment_date">评论时间：' + orderitem.cid.date + '</h3>\
											</div>');
											
									//评论图片
									var commentphotos = orderitem.cid.photo;
									for (var k = 0; k < commentphotos.length; k++) {
										$(".order .order_item").eq(i).find(".cart .cart_item").eq(j).find(".comment_photo")
											.append('<div style="position:relative"><li class="qqqq" style="background: url(' + commentphotos[k].replace(/\\/g, "/") + ') 50% 50% no-repeat;background-size: 100% 100%;"></li></div>');
									}
									
								}
							}
							
							photos.num++;
						}
						
						photos.detail.push(j);
						
					}
					
					//判断是否有图片需要加载
					if (photos.num != 0) {
						//显示加载白页
						$(".loading").show();
						
						//获取照片
						for (var i = 0; i < photos.detail.length; i++) {
							(function (i) {
								for (var j = 0; j < photos.detail[i]; j++) {
									(function (j) {
										var cartitem = $(".order .order_item").eq(i).find(".cart .cart_item").eq(j);
										var gid = cartitem.attr("gid");
										
										$.ajax({
											type:"get",
											url:"/goodphoto/getShowPhoto/" + gid,
											async:true,
											success:function(photo){
												cartitem.find("img").attr("src","/img/upload/" + photo);
												
												photos.num--;
												if (photos.num == 0) {
													//清除加载白页
													$(".loading").hide();
												}
												
											},
											error:function(err){
												console.log(err);
											}
										});
										
									})(j);
								}
							})(i);
							
						}
					}
					
					
				} else{
					//去除加载白页
					$(".loading").hide();
					
					//无数据时显示信息
					$(".attention").show();
					$(".attention .cart_empty").html("您没有" + $(".order_type").find(".underline h3").html()+"的订单");
					
				}
			},
			error:function(err){
				console.log(err);
			}
		});
		
	}
	
	
	
	//商品页面跳转控制
	function togoodinfo(e){
		var gid;
		if ($(e.target).hasClass("cart_item")) {
			gid = $(e.target).attr("gid");
	          location.assign("/views/goodInfo/goodInfo.html?gid=" + gid);
			
		}else {
			var commentBtn = $(e.target).parents(".cart_item").find(".item_comment");
			var commentContent = $(e.target).parents(".cart_item").find(".item_bottom");
	        if (!commentBtn.is(e.target) && !commentContent.is(e.target) && commentContent.has(e.target).length === 0){
				gid = $(e.target).parents(".cart_item").attr("gid");
	          	location.assign("/views/goodInfo/goodInfo.html?gid=" + gid);
	        }
	        
		}
	}
	
	//查看收货信息控制
	function tolocation (e) {
		$(e.target).html($(e.target).html() == "查看收货信息"?"收起收货信息":"查看收货信息")
					.parent().siblings(".location_info").slideToggle();
		$(e.target).parents(".order_item").siblings("li").find(".location_info").slideUp();
		$(e.target).parents(".order_item").siblings("li").find(".order_location").html("查看收货信息");
	}
	
	//去付款控制
	function topay (e) {
		var url = "";
		var oid = $(e.target).parents(".order_item").attr("oid");
		var orderitems = $(e.target).parents(".order_item").find(".cart_item");
		
		//拼接url
		for (var i = 0; i < orderitems.length; i++) {
			if (url != "") {
				url += "&" + orderitems.eq(i).attr("otid");
			}else{
				url += "?otids=" + orderitems.eq(i).attr("otid");
			}
		}
		url += "&&oid=" + oid;
		
		location.assign("/views/order/pay.html" + url);
	}
	
	//确认收货控制
	function tofinish (e) {
		var oid = $(e.target).parents(".order_item").attr("oid");
		
		$.ajax({
			type:"post",
			url:"/order/updateorder",
			data:{
				otid:oid,
				flag:4,
			},
			async:true,
			success:function(data){
				reloadView(2);
			},
			error:function(err){
				console.log(err);
			}
		});
	}
	
	//评论控制
	function tocomment (e) {
		var oid = $(e.target).parents(".order_item").attr("oid");
		var otid = $(e.target).parents(".cart_item").attr("otid");
		
		//当前订单其他订单项都被评价时
		var commentBtn =  $(e.target).parents(".cart_item").siblings("li").find(".item_comment");
		$(".comment").attr("oid",oid);
		for (var i = 0; i < commentBtn.length; i++) {
			if(commentBtn.eq(i).html() == "评价"){
				$(".comment").attr("oid","");
				break;
			}
		}
		
		$(".com_txt textarea").val("");		
		$(".comment").attr("otid",otid);
		$(".com_txt input[name=gid]").val($(this).parents(".cart_item").attr("gid"));
		$(".comment").animate({top:"0%"},500);
		
		//页面锁定
		$("body").css("overflow", "hidden");
	}
	
	//查看评论控制
	function toviewcomment (e) {
		$(e.target).parents(".cart_item").find(".item_bottom").slideToggle();
		$(e.target).html($(e.target).html() == "查看评价"? "收起评价":"查看评价");
	}
	
	$(".compic").on('click','li .delPhoto',function(){
		var index=$(this).parent().index();
     	console.log($(this).parent().index());
     	if($(".compic li").length>1){
     			$(".compic li").eq(index).remove();
     	}else{  		
     		$(".compic li").eq(index).find("input").val("");
     		$(".compic li").eq(index).find("img").attr('src','');
     		$(".compic li").eq(index).find("img").css('display','none');
     	    $(".compic li").eq(index).find("div").css('display','none');
     		
     	}
     
     });
});