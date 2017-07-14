$(function(){
	/*------------------------------------------头部*/
	/*--------------------------------------------搜索栏*/
	/*------------------------------------------广告轮播*/
	var i = 0;
	var j = 0;
	var _left;
	function showImg()
	{
		i = i+1;
		_left = i*(-405)+"px";
		$(".adcontainer").animate({left: _left},1500,function(){
			if(parseInt($(".adcontainer").css("left")) < -2025)
			{
				$(".adcontainer").css("left","0px");
				i = 0;
			}
		});
	}
	setInterval(showImg,3000);
	function showList()
	{
		j = j+1;
		if(j > 6)
		{
			j =0;
		}		
		$(".adturnullist").css("background-color","#CED4D2")
		$("#l"+(j+1)).css("background-color","orange")
	}
	setInterval(showList,3000);
	/*------------------------------------------新闻轮播*/
	
	function shownews()
	{
		$(".newscontainer").animate({left: '-1000px'},30000,
		function(){
			if(parseInt($(this).css("left"))< -800)
			{
				$(this).css("left","400px");
			}
		})		
	}
	shownews();
	setInterval(shownews,30000);
	
	/*------------------------------------------选项卡*/
	$(".lnbtitle-info").click(function(){
		$(".innisinformation").css("display","inline-block");
		$(".activities").css("display","none");
		$(".communicate").css("display","none");
	});
	$(".lnbtitle-act").click(function(){
		$(".innisinformation").css("display","none");
		$(".activities").css("display","inline-block");
		$(".communicate").css("display","none");
	});
	/*--------------------------------------------热销*/
	$(".hotgoods-nav-li").click(function(){
		$(".hotgoods-nav-li").each(function(){
			$(this).css("color","#CCD9BB")
			$(this).css("border-bottom","0px")
		})
		$(this).css("color","#799656");
		$(this).css("border-bottom","2px solid #799656")
	})
	
});

