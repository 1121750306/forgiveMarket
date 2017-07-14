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
		_left = i*(-412)+"px";
		$(".adcontainer").animate({left: _left},1500,function(){
			if(parseInt($(".adcontainer").css("left")) < -2060)
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
	
	/*-----------------------------------------------搞事情的叶子*/
	window.onscroll = function(e)
	{
		var scrollh = document.body.scrollTop ||  document.documentElement.scrollTop;
		if(scrollh >0 && scrollh < 741)
		{
			$(".yezi").css("display","inline-block")
			$(".yezi").css("margin-top","640px")
		}
		else if(scrollh>741 && scrollh <800)
		{
			$(".yezi").css("margin-top","700px")
			$(".yezi").css("margin-left","45%")
		}
		
		else if (scrollh >800 && scrollh < 900)
		{
			$(".yezi").css("margin-top","780px")
			$(".yezi").css("margin-left","45%")
		}
		else if (scrollh >900 && scrollh < 1000)
		{
			$(".yezi").css("margin-top","820px")
			$(".yezi").css("margin-left","45%")
		}
		else if (scrollh >1000 && scrollh < 1100)
		{
			$(".yezi").css("margin-top","880px")
			$(".yezi").css("margin-left","45%")
		}
		else if (scrollh >1100 && scrollh < 1200)
		{
			$(".yezi").css("margin-top","970px")
			$(".yezi").css("margin-left","18%")
		}
		else if (scrollh >1200 && scrollh < 1300)
		{
			$(".yezi").css("margin-top","1070px")
			$(".yezi").css("margin-left","55%")
		}
		else if (scrollh >1300 && scrollh < 1400)
		{
			$(".yezi").css("margin-top","1130px")
			$(".yezi").css("margin-left","53%")
		}
		else if (scrollh >1400 && scrollh < 1450)
		{
			$(".yezi").css("margin-top","1200px")
			$(".yezi").css("margin-left","83%")
		}
		else if (scrollh >1450 && scrollh < 1500)
		{
			$(".yezi").css("margin-top","1250px")
			$(".yezi").css("margin-left","25%")
		}
		else if (scrollh >1500 && scrollh < 1550)
		{
			$(".yezi").css("margin-top","1280px")
			$(".yezi").css("margin-left","25%")
		}
		else if (scrollh >1550 && scrollh < 1600)
		{
			$(".yezi").css("margin-top","1330px")
			$(".yezi").css("margin-left","30%")
			$(".yezi").animate({
				left : '60%'
			},1000)
		}	
	
	}
	/*--------------------------popdiv*/
	var _wheeldelta = function(e)
	{
		e = e || window.event;
		console.log(e.wheelDelta);
		if(e.wheelDelta < 0)
		{
			var scrollh = document.body.scrollTop ||  document.documentElement.scrollTop;
			console.log(scrollh)
			if(scrollh >1600 && scrollh <1700)
			{
				$(".popdiv").slideDown();		
				$(".popdiv-close").click(function(){
					$(".popdiv").slideUp();
				})
			}			
		}				
	}
	window.onmousewheel = document.onmousewheel = _wheeldelta; 
	
});

