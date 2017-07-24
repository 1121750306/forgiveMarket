$(function() {
	/*------------------------------------------头部*/
	/*--------------------------------------------搜索栏*/
	$(".clearsearchhistory").click(function() {
		$(".searchhistory-ul").html("");
	})

	$(".closesearchhistory").click(function() {
		$(".searchhistorycontainer").css("display", "none")
	})

	var i;

	$(".search-textbox").focus(function() {
		$(".searchhistorycontainer").css("display", "inline-block");
		$(document).keypress(function(e) {
			if (e.which == 13) {
				$(".searchhistorycontainer").css("display", "none")
				var searchtext = $(".search-textbox").val();
				if (searchtext) {

					$(".searchhistory-ul").prepend('<li class="searchhistory-li">' + searchtext + '<img class="searchhistory-li-closeimg" src="../img/innisfreeIco/close.png"/></li>')
					$(".search-textbox").val(null);
					$(".searchhistory-ul").find("li")[6].remove()
						//历史记录跳转
					$("#searchhistory li").each(function() {
						var li = $(this);
						li.click(function() {
							var content = li.text();
							console.log(content);
							//跳转
							window.location.assign("/views/goodinfo/goodlist.html?content=" + content);
						});
					});
				}

			}
		});

		$(".searchhistory-li-closeimg").click(function() {
			event.stopPropagation();
			i = $(".searchhistory-li-closeimg").index(this);
			console.log(i)
			$(".searchhistory-ul").find("li")[i].remove()
		});
	});
	//	$(".search-textbox").blur(function(){
	//		$(".searchhistorycontainer").css("display", "none");
	//	})
	/*------------------------------------------广告轮播*/
	var i = 0;
	var j = 1;
	var _left;
	var showimg;
	var showlist;
	//	var picwidth = $(".adpicture").width()

	function showImg() {
		var picwidth = $(".adpicture").width();
		i = i + 1;
		_left = -(i * picwidth) + "px";
		$(".adcontainer").animate({
			left: _left
		}, 1500, function() {
			if (parseInt($(".adcontainer").css("left")) == -6 * picwidth) {
				$(".adcontainer").css("left", "0px");
				i = 0;
			}
		});

	}

	function showList() {
		j = j + 1;
		if (j > 6) {
			j = 1;
		}
		$(".adturnullist").css("background-color", "#CED4D2")
		$("#l" + j).css("background-color", "orange")
	}

	function showimgCtrl() {
		showimg = setTimeout(function() {
			showImg();
			setTimeout(showimgCtrl, 0)
		}, 3000)
	}
	showimgCtrl();

	function showlistCtrl() {
		showlist = setTimeout(function() {
			showList();
			setTimeout(showlistCtrl(), 0)
		}, 3000)
	}
	showlistCtrl();
	//在adcontainer中手指触屏停止轮播,获取触屏位置
	var startX;
	var startY;
	var endX;
	var endY;
	var adturnctrl = document.getElementById("adturn");
	adturnctrl.addEventListener("touchstart", function(e) {
			clearTimeout(showimg);
			clearTimeout(showlist);
			startX = e.changedTouches[0].pageX;
			startY = e.changedTouches[0].pageY;
			//滑动，获取滑动结束坐标
			adturnctrl.addEventListener("touchmove", function(e) {
				clearTimeout(showimg);
				clearTimeout(showlist);
				endX = e.changedTouches[0].pageX;
				endY = e.changedTouches[0].pageY;
			})
		})
		//手指抬起，判断滑动方向，计算滑动距离
		//滑动距离超过半屏，触屏结束，adcontainer滑动412px，继续轮播

	adturnctrl.addEventListener("touchend", function() {
		var picwidth = $(".adpicture").width();
		var dx = endX - startX;

		if (dx < -60) {

			if (parseInt($(".adcontainer").css("left")) > -2060) {
				i = i + 1;
				$(".adcontainer").animate({
					left: '-=' + picwidth + 'px'
				}, 1500);

			}
			if (j < 6) {
				j = j + 1;
				$(".adturnullist").css("background-color", "#CED4D2")
				$("#l" + j).css("background-color", "orange")
			}

		} else if (dx > 60) {

			if (parseInt($(".adcontainer").css("left")) < 0) {
				i = i - 1;
				$(".adcontainer").animate({
					left: '+=' + picwidth + 'px'
				}, 1500);
			}
			if (j > 1) {
				j = j - 1;
				$(".adturnullist").css("background-color", "#CED4D2")
				$("#l" + j).css("background-color", "orange")
			}

		}
		showimgCtrl();
		showlistCtrl();
	})

	/*------------------------------------------新闻轮播*/

	function shownews() {
		$(".newscontainer").animate({
				left: '-1000px'
			}, 30000,
			function() {
				if (parseInt($(this).css("left")) < -800) {
					$(this).css("left", "400px");
				}
			})
	}
	shownews();
	setInterval(shownews, 30000);

	/*------------------------------------------选项卡*/
	$(".lnbtitle-info").click(function() {
		$(".innisinformation").css("display", "inline-block");
		$(".activities").css("display", "none");
		$(".communicate").css("display", "none");
	});
	$(".lnbtitle-act").click(function() {
		$(".innisinformation").css("display", "none");
		$(".activities").css("display", "inline-block");
		$(".communicate").css("display", "none");
	});
	/*--------------------------------------------热销*/
	$(".hotgoods-nav-li").click(function() {
		$(".hotgoods-nav-li").each(function() {
			$(this).css("color", "#CCD9BB")
			$(this).css("border-bottom", "0px")
		})
		$(this).css("color", "#799656");
		$(this).css("border-bottom", "2px solid #799656")
	})

	/*-----------------------------------------------搞事情的叶子*/
	window.onscroll = function(e) {
		var lock = false;
			var scrollh = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollh > 0 && scrollh < 741) {
				$(".yezi").css("margin-left", "45%")
				$(".yezi").css("display", "inline-block")
				$(".yezi").css("margin-top", "640px")
			} else if (scrollh > 741 && scrollh < 800) {
				$(".yezi").css("margin-top", "700px")
				$(".yezi").css("margin-left", "45%")
			} else if (scrollh > 800 && scrollh < 900) {
				$(".yezi").css("margin-top", "780px")
				$(".yezi").css("margin-left", "45%")
			} else if (scrollh > 900 && scrollh < 1000) {
				$(".yezi").css("margin-top", "820px")
				$(".yezi").css("margin-left", "45%")
			} else if (scrollh > 1000 && scrollh < 1100) {
				$(".yezi").css("margin-top", "880px")
				$(".yezi").css("margin-left", "45%")
			} else if (scrollh > 1100 && scrollh < 1200) {
				$(".yezi").css("margin-top", "970px")
				$(".yezi").css("margin-left", "18%")
			} else if (scrollh > 1200 && scrollh < 1300) {
				$(".yezi").css("margin-top", "1070px")
				$(".yezi").css("margin-left", "55%")
			} else if (scrollh > 1300 && scrollh < 1400) {
				$(".yezi").css("margin-top", "1130px")
				$(".yezi").css("margin-left", "53%")
			} else if (scrollh > 1400 && scrollh < 1450) {
				$(".yezi").css("margin-top", "1200px")
				$(".yezi").css("margin-left", "83%")
			} else if (scrollh > 1450 && scrollh < 1500) {
				$(".yezi").css("margin-top", "1250px")
				$(".yezi").css("margin-left", "25%")
			} else if (scrollh > 1500 && scrollh < 1550) {
				$(".yezi").css("margin-top", "1280px")
				$(".yezi").css("margin-left", "25%")
			} else if (scrollh > 1550 && scrollh < 1600) {
				$(".yezi").css("margin-top", "1330px")
				$(".yezi").css("margin-left", "30%")
				$(".yezi").animate({
					left: '60%'
				}, 1200,function(){$(".innisinformation div").css('display','none')})
			} else if (scrollh > 1800) {
				$(".yezi").css("display", "none")

			}
		}
		/*--------------------------popdiv*/
	var _wheeldelta = function(e) {
		e = e || window.event;
		if (e.wheelDelta < 0) {
			var scrollh = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollh > 1600 && scrollh < 1800) {
				//				$(".popdiv").slideDown();
				//				$(".popdiv-close").click(function() {
				//					$(".popdiv").slideUp();
				//				})
			}
		}
	}
	window.onmousewheel = document.onmousewheel = _wheeldelta;

	$(".backtotop").click(function() {
		scrollTo(0, 0);
	})

	fixImage();

	//搜索按钮事件
	$("#btn_search").click(function() {
		var content = $("#input_search").val();
		console.log(content);
		//跳转
		window.location.assign("/views/goodinfo/goodlist.html?content=" + content);
	});

	//搜索记录跳转
	$("#searchhistory li").each(function() {
		var li = $(this);
		li.click(function() {
			var content = li.text();
			console.log(content);
			//跳转
			window.location.assign("/views/goodinfo/goodlist.html?content=" + content);
		})
	})

	//获取推荐列表
	getTopSix(function(data, err) {
		console.log(data)
		if (err) {
			console.log(err);
			return;
		}
		$("#hotgoods-container").empty();
		if (data.flag == 200) {
			for (var i = 0; i < data.result.length; i++) {
				var divId = 'top' + i;
				var html = `<div id='${divId}' class="hotgood" gid='${data.result[i].good._id}'>\
								<div>\
									<img src="/img/innisfreeIco/pic_loading.png" />\
									<span class="good_name">${data.result[i].good.gname}</span>\
									<span class="good_price">¥${data.result[i].good.pricebase}</span>
								</div>\
							</div>`;
				$("#hotgoods-container").append(html);
				setImage($("#" + divId), data.result[i].good._id);
			}
			//跳转商品详情
			$("#hotgoods-container .hotgood div").each(function() {
				var div = $(this);
				div.click(function() {
					var gid = div.parent().attr("gid");
					console.log(gid);
					if (gid != undefined) {
						window.location.assign("/views/goodInfo/goodInfo.html?gid=" + gid);
					}
				})
			});
		}
	})
	
	//滚动栏
	$.ajax({
		type:"get",
		url:"/users/getrandomuser",
		async:true,
		success:function(data){
			if(data.flag == 200){
				var text = `恭喜${data.result.uname}(${data.result.phone.substring(0,3) + "******" + data.result.phone.substring(9,11)})获得男士护肤一套`;
				console.log(text);
				$(".newscontainer").empty();
				$(".newscontainer").append(`<a href="">${text}</a>`)
			}
		}
	});
	
});

/**
 * 动态设置图片宽度
 */
function fixImage() {
	var width = $("#adturn").width();
	console.log(width);
	$("#adturn .adcontainer .adpicture").each(function() {
		$(this).width(width);
	});
	return width;
}

function setImage(obj, gid) {
	console.log(obj);
	//获取图片路径
	$.ajax({
		type: "get",
		url: "/goodphoto/getShowPhoto/" + gid,
		async: true,
		success: function(data) {
			console.log(data);
			obj.find("img").attr("src", '/img/upload/' + data);
		}
	});
}