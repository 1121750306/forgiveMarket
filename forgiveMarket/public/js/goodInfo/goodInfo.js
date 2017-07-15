/**
 * Created by wanganyu on 2017/7/13.
 */
$(function() {
	var c = 35; //假设库存为35
	//滚动切换事件
	var ht = [];
	var ctP = $(".good-ct")[0].offsetTop;
	var detailP = $(".good-detail")[0].offsetTop - parseInt($(".good-ct").css('padding-top'));
	var commentP = $(".comment")[0].offsetTop - parseInt($(".good-ct").css('padding-top'));

	var mainlock = false;//控制主按钮的锁
	ht.push(ctP);
	ht.push(detailP);
	ht.push(commentP);

	//滚轮事件
	$(window).scroll(function(e) {
		var t = $(document).scrollTop();
		for(var i = 0; i < ht.length; i++) {
			if(t > ht[i]) {
				$("#main-ctr .ctrbtn").removeClass("on");
				$("#main-ctr .ctrbtn").eq(i).addClass('on');
			}
		}
	})

	//切换事件
	$("#main-ctr .ctrbtn").click(function() {
		// $("#main-ctr .ctrbtn").removeClass("on");
		// $(this).addClass('on');
		if(!mainlock){
            mainlock = true;
            var index = $("#main-ctr .ctrbtn").index($(this));
            console.log(ht[index]+2 + "px");
            $('body').animate({
                scrollTop: ht[index]+2
            },function(){
            	mainlock = false;
			})
		}

	})
	$(".choice-box .good-type li").click(function() {
		$(".choice-box .good-type li").removeClass("on");
		$(this).addClass('on')
	})

	//模态框事件
	$(".choice").click(function() {
		$("#choice-bg").css('display', 'block')
		$(".choice-box").css('display', 'block')
		$(".choice-box").animate({
			bottom: '0'
		}, '300')
	})
	$("#choice-bg").click(function(e) {
		$(".choice-box").animate({
			bottom: '-500px'
		}, '300', function() {
			$(".choice-box").css('display', 'none');
			$("#choice-bg").css('display', 'none')
			return false;
		})
	})
	$(".choice-box .cross span").click(function() {
		$(".choice-box").animate({
			bottom: '-500px'
		}, '300', function() {
			$(".choice-box").css('display', 'none');
			$("#choice-bg").css('display', 'none')
			return false;
		})
	})
	//数量增加事件
	$(".count-box .ctr-sub").click(function() {
		if(Number($(".count-box .count-num").val()) > 1) {
			$(".count-box .count-num").val(Number($(".count-box .count-num").val()) - 1)
		}
	})
	$(".count-box .ctr-add").click(function() {
		if(Number($(".count-box .count-num").val()) < c) {
			$(".count-box .count-num").val(Number($(".count-box .count-num").val()) + 1)
		}
	})
	$(".count-box .count-num").change(function() {
		checkCount();
	})
	$(".count-box .count-num").keyup(function() {
		checkCount();
	})

	function checkCount() {
		$(".count-box .count-num").val($(".count-box .count-num").val().replace(/[^\d]/g, ''))
		console.log(Number($(".count-box .count-num").val()))
		if(Number($(".count-box .count-num").val()) > c) {
			$(".count-box .count-num").val(c)
		} else if(Number($(".count-box .count-num").val()) < 1) {
			$(".count-box .count-num").val(1)
		}
	}
})