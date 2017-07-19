$(function(){
	//排序方式控制
	$(".goodorder").click(function(){
		$(".orderby").slideToggle(300);
	});
	$(".orderby li").click(function(){
		$(this).css("color", "rgba(5, 83, 33, 1)").siblings("li").css("color", "grey");
		$(".goodorder").html($(this).html().substr(1));
	});
	
	//正逆序控制
	$(".orientation").click(function(){
		var orientation = $(this).html();
		if (orientation == "正序") {
			$(this).html("逆序");
		}else {
			$(this).html("正序");
		}
	});
	
	//搜索按钮显示控制
	$(".search input").focus(function(){
		$(".search").animate({"width":"80%"},function(){
			$(".banner h2").show();
		});
		
	});
	$(".search input").blur(function(){
		$(".banner h2").hide();
		$(".search").animate({"width":"96%"});
	});
	
})

//搜索控制
function search () {
	alert("!23");
}
