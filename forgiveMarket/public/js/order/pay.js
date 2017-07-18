$(function(){
	//获取url中订单项数据
	var otids = location.search.substr(7).split("&");
	
	for (var i = 0; i < otids.length; i++) {
		//请求订单项数据
		$.ajax({
			type:"get",
			url:"/order/getorderitem/" + otids[i],
			async:true,
			success:function(data){
				var good = data[0];
							
				//拼接商品规格
				var goodsizeUl = "";
				for (var j = 0; j < good.gsizes.length; j++) {
					goodsizeUl = goodsizeUl + "<li><h4>" + good.gsizes[j].gsid.gsname +"</h4></li>";
				}
				
				//组合li
				var li ='<li class="cart_item">\
							<img class="img" src="/img/innisfree-img/goods/1000000311_l.png"/>\
							<div class="item_info">\
								<h2>' + good.gid.gname + '</h2>\
								<ul class="good_size">' + goodsizeUl + '</ul>\
								<div class="info_bottom">\
									<a class="money">' + good.gid.pricebase + '</a>\	
									<a class="mount">x' + good.num + '</a>\
								</div>\
							</div>\
						</li>';
					
				$(".cart").append(li);
				
				console.log(data);
			},
			error:function(err){
				console.log(err);
			}
		});
	}
	
	//计算总价
	var totalmoney =0;
	var i = 0;
	$(".money").each(function(){	
		totalmoney= totalmoney + parseInt(this.innerHTML);
		$(".totalpay").html("总计："+totalmoney)
	})
	
	$(".cart_item").each(function(){	
		i = i+1;
		$(".totalcount").html("共"+i+"件商品")
	})
})
