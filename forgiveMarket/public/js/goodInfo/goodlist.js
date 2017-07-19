$(function(){
	$.ajax({
		type:"post",
		url:"/order/addtocart",
		data:{
			uid:JSON.parse(sessionStorage.getItem("user"))._id,
			gid:"596c7fb7806c5204cc6a0b04",
			gsids:JSON.stringify(["596c8155693f4621c0da48e0", "596c8155693f4621c0da48e1"]),
			num: "2"
		},
		async:true,
		success:function(result){
			console.log(result);
		},
		error:function(err){
			console.log(err);
		}
	});
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
