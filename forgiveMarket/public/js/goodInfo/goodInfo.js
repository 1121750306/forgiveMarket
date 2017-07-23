/**
 * Created by wanganyu on 2017/7/13.
 */
$(function() {

	{
		var goodInfo;
		var goodtype;
		var url = location.search
		if(url != '') {
			url = url.substring(1);
			var gid = url.split('&')[0].split('=')[1];
			console.log(gid);
			$.ajax({
				type: "get",
				url: "/goodInfo/" + gid,
				async: true,
				success: function(data) {
					console.log(data);
					goodInfo = data.info;
					goodtype = data.type;
					console.log(goodtype.sort(reverse(1, 'gsname')))
					/*修改数据*/
					$(".good-name").text(goodInfo[0].gid.gname);
					$(".good-usage").text(goodInfo[0].usage);
					$(".good-fitwhere").text(goodInfo[0].fitwhere);
					for(var i = 0; i < goodtype.length; i++) {
						$(".choice-box .good-type ul").append(
							"<li data-typeIndex=" + i + "><span>" + goodtype[i].gsname + "</span></li>"
						);
					}
					$(".choice-box .good-type ul").children().eq(0).addClass('on');
					$(" .good-container").text(goodInfo[0].container);
					$(" .good-infotype").text(goodInfo[0].gid.typeid.tname);
					$(".good-fitskin").text(goodInfo[0].fitSkin);
					$(".good-packing").text(goodInfo[0].packing);
					$(".good-tip").text(goodInfo[0].tip);
					$(".good-basis").text(goodInfo[0].basis);
					getGoodPhoto();

					var typeindex = $(".good-type .on").attr('data-typeindex');
					$(".choice-box .type-price span").text((goodInfo[0].gid.pricebase + goodtype[typeindex].priceoffset))
					$(".choice-box .type-lefts span").text(goodtype[typeindex].lefts)
                    $(".choice-box .type-lefts sa").text(goodtype[typeindex].sales)

					if(isLogin()) {
						console.log(5);
						saveHistory();
						isCollect();
						getcartdata()
					}

					/*
					 重新渲染
					 * */

					$("#load").css('display', 'none');
					$('body').removeClass('overhide')
					$("#main-ctr").css('display', 'block');
					$(".tot-ctr").css('display', 'block');

					ht = [];
					var ctP = $(".good-ct")[0].offsetTop;
					var detailP = $(".good-detail")[0].offsetTop - parseInt($(".good-ct").css('padding-top'));
					var commentP = $(".comment")[0].offsetTop - parseInt($(".good-ct").css('padding-top'));
					var mainlock = false; //控制主按钮的锁
					ht.push(ctP);
					ht.push(detailP);
					ht.push(commentP);
				}
			});
		}
	}

	{
		function saveHistory() {
			$.ajax({
				type: "post",
				url: "/history/addhistory",
				async: true,
				data: {
					gid: goodInfo[0].gid._id
				},
				success: function(data) {
					if(data.flag == 200) {
						console.log("历史记录添加成功");
					} else {
						console.log("历史记录添加出错")
					}
				},
				error: function() {
					console.log("ajax错误")
				}
			})

		}

		function isCollect() {

			$.ajax({
				type: "post",
				url: "/collect/iscollect",
				async: true,
				data: {
					gid: goodInfo[0].gid._id
				},
				success: function(data) {
					console.log(data)
					if(data.flag == 200) {
						$(".tot-ctr .collect i").css('background-image', 'url(../../img/innisfreeIco/collect1.png)')
						$(".tot-ctr .collect").attr('data-type', '1')
					} else if(data.flag == 300) {
						$(".tot-ctr .collect i").css('background-image', 'url(../../img/innisfreeIco/collect0.png)')
						$(".tot-ctr .collect").attr('data-type', '0')
					}
				}
			});
		}
	}
	var c = 35; //假设库存为35
	//滚动切换事件
	ht = [];
	var ctP = $(".good-ct")[0].offsetTop;
	var detailP = $(".good-detail")[0].offsetTop - parseInt($(".good-ct").css('padding-top'));
	var commentP = $(".comment")[0].offsetTop - parseInt($(".good-ct").css('padding-top'));
	var mainlock = false; //控制主按钮的锁
	ht.push(ctP);
	ht.push(detailP);
	ht.push(commentP);
	console.log(ht)
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
		if(!mainlock) {
			mainlock = true;
			var index = $("#main-ctr .ctrbtn").index($(this));
			console.log(ht[index] + 2 + "px");
			$('body').animate({
				scrollTop: ht[index] + 2
			}, function() {
				mainlock = false;
			})
		}

	})

	{
		$(".choice-box .good-type").on('click', 'li', function() {
			$(".choice-box .good-type li").removeClass("on");
			$(this).addClass('on');

			var typeindex = parseInt($(this).attr('data-typeindex'));
			if(Number($(".count-box .count-num").val()) > goodtype[typeindex].lefts) {
				$(".count-box .count-num").val(goodtype[typeindex].lefts)
			}

			$(".choice-box .type-price span").text((goodInfo[0].gid.pricebase + goodtype[typeindex].priceoffset))
			$(".choice-box .type-lefts span").text(goodtype[typeindex].lefts);
            $(".choice-box .type-lefts sa").text(goodtype[typeindex].sales);
			$(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text() * parseInt($(".count-box .count-num").val()))

		})

	}

	//图片轮播
	{
		function lunbo() {
			var imgNum = $(".good-ct .img-ctr").children().length;
			var preIndex = $(".ct-imgList .img-ctr span").index($(".ct-imgList .img-ctr .on"));
			var nowIndex;
			if(preIndex >= imgNum - 1) {
				nowIndex = 0;
			} else {
				nowIndex = preIndex + 1;
			}
			$(".ct-imgList .img-ctr span").removeClass('on');
			$(".ct-imgList .img-ctr span").eq(nowIndex).addClass('on')
			$(".ct-imgList .img-wrap").animate({
				marginLeft: -300 * nowIndex
			}, 1000)
		}

		// var t = setTimeout(function () {
		//     lunbo();
		//     clearTimeout(t);
		//     t = setTimeout(arguments.callee, 3000);
		// }, 1000)
		//
		// window.onblur = function () {
		//     clearTimeout(t);
		// }
		// window.onfocus = function () {
		//     setTimeout(function () {
		//         lunbo();
		//         clearTimeout(t);
		//         t = setTimeout(arguments.callee, 3000);
		//     }, 1000)
		// }
	}

	//模态框事件
	$(".choice").click(function() {
		$("#choice-bg").css('display', 'block');
		$(".choice-box").css('display', 'block');
		$(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text() * parseInt($(".count-box .count-num").val()))
		$(".choice-box").animate({
			bottom: '0'
		}, '300')

	})
	$("#choice-bg").click(function(e) {
		$(".choice .right span").eq(0).text($(".good-type ul .on span").text() + " * ")
		$(".choice .right .good-num").text($(".count .count-box .count-num").val());
		console.log($(".count .count-box .count-num").val() + "p")
		$(".choice-box").animate({
			bottom: '-500px'
		}, '300', function() {
			$(".choice-box").css('display', 'none');
			$("#choice-bg").css('display', 'none')
			return false;
		})
	})
	$(".choice-box .cross span").click(function() {
		$(".choice .right .good-tp").text($(".good-type ul .on span").text() + "*");
		console.log($(".count .count-box .count-num").val() + "p")
		$(".choice .right .good-num").text($(".count .count-box .count-num").val());
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
		$(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text() * parseInt($(".count-box .count-num").val()))

	})
	$(".count-box .ctr-add").click(function() {
		var index = $(".good-type ul .on").attr('data-typeindex');
		if(Number($(".count-box .count-num").val()) < goodtype[index].lefts) {
			$(".count-box .count-num").val(Number($(".count-box .count-num").val()) + 1)
		}
		$(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text() * parseInt($(".count-box .count-num").val()))

	})
	$(".count-box .count-num").change(function() {
		checkCount();
		if($(".count-box .count-num").val() == '') {
			$(".count-box .count-num").val('1');
		};
		$(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text() * parseInt($(".count-box .count-num").val()))

	})
	$(".count-box .count-num").keyup(function() {
		checkCount();
		if($(".count-box .count-num").val() != '') {
			$(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text() * parseInt($(".count-box .count-num").val()))
		}
	})

	function checkCount() {
		var index = parseInt($(".good-type ul .on").attr('data-typeindex'));
		if($(".count-box .count-num").val() != '') {
			$(".count-box .count-num").val($(".count-box .count-num").val().replace(/[^\d]/g, ''))
			console.log(Number($(".count-box .count-num").val()))
			if(Number($(".count-box .count-num").val()) > goodtype[index].lefts) {
				$(".count-box .count-num").val(goodtype[index].lefts)
			} else if(Number($(".count-box .count-num").val()) < 1) {
				$(".count-box .count-num").val(1)
			}
		}
	}

	//
	// function changeTotal() {
	// 	$(".box-total")
	// }

	{ //评论
		var commentData;
        // var gid = goodInfo[0].gid._id;
		console.log(gid)
		$.ajax({
			type: "get",
			url: "/comment/getgoodComment"+gid,
			async: true,
			success: function(data) {
				console.log(data);
				commentData = data;
				var loginsign= false;
				var user;
				if(sessionStorage.user){
					loginsign = true;
					user = JSON.parse(sessionStorage.user)
				}
				var l = data.length > 6 ? 6 : data.length;
				var pageTotal = Math.ceil(data.length / 6);
				if(pageTotal == 0) pageTotal = 1;
				var pageCur = 1;
				$(".comment .comment-ctr span strong").text(pageCur);
				$(".comment .comment-ctr span span").text( pageTotal);
				$("#main-ctr button span").text(commentData.length);
				$(".comment .comment-hd h4 span").text(commentData.length)
				for(var i = 0; i < l; i++) {
					var str = '<div class="item" data-index=' + i + '>' +
											'<img src="'+data[i].uid.avatar+'" />'+
						// '<img src="../../img/innisfreeIco/avatar.png" />' +
						'<div class="item-right clearfix">' +
						'<h5>' + data[i].content + '</h5>' +
						'<div class="item-rb">' +
						'<strong class="itemname">' + data[i].uid.uname + '</strong> &nbsp;&nbsp;' +
						'<span>(' + data[i].date.substring(0, 10) + ')</span>' +
						'<div class="item-inte">' +
						'<span class="com-btn clearfix"><i class="com-ico"></i><span>';
					if(data[i].sonComment.length > 0) {
						str += data[i].sonComment.length;
					} else {
						str += '评论';
					}
					var str2 = '</span></span> ' +
						'<span class="thumb-btn clearfix"><i class="thumb';
					var str3 = '0';
					var s = commentData[i].thumb.some(function(value,index,arr){
						return value._id==user._id;
					})

					if(loginsign){
                        if(s){
                        	str3 = '1';
                        }
					}
					console.log(commentData[i].thumb[0])
					console.log(user._id)
					var str4 = '-ico"></i><span>';
                    var str5 = '点赞';
					if(data[i].thumb.length!=0){
						str5 = data[i].thumb.length;
					}

					var str6 = '</span></span>' +
						'</div></div></div></div>';
					str = str + str2+str3+str4+str5;
					$(".comment .comment-ct").append(str);
				}

			},
			error: function(data) {
				console.log(data)
			}
		});

		//评论翻页
		$(".comment .comment-ctr .ctr").click(function(){
			var dire = $(this).attr('data-dire');
			var curpage = $(".comment .comment-ctr span strong").text();
			var targetPage = parseInt(dire)+parseInt(curpage);
			var totalPage = $(".comment .comment-ctr span span").text()
            var loginsign= false;
            var user;
            if(sessionStorage.user){
                loginsign = true;
                user = JSON.parse(sessionStorage.user)
            }
			if(1<=targetPage&&targetPage<=parseInt(totalPage)){
				$(".comment .comment-ct").empty();
                var le = commentData.length-(targetPage-1)*6 > 6 ? 6*targetPage : commentData.length;
                $(".comment .comment-ctr span strong").text(targetPage);
                for(var i = 6*(targetPage-1); i < le; i++) {
                    var str = '<div class="item" data-index=' + i + '>' +
                        '<img src="'+commentData[i].uid.avatar+'" />'+
                        // '<img src="../../img/innisfreeIco/avatar.png" />' +
                        '<div class="item-right clearfix">' +
                        '<h5>' + commentData[i].content + '</h5>' +
                        '<div class="item-rb">' +
                        '<strong class="itemname">' + commentData[i].uid.uname + '</strong> &nbsp;&nbsp;' +
                        '<span>(' + commentData[i].date.substring(0, 10) + ')</span>' +
                        '<div class="item-inte">' +
                        '<span class="com-btn clearfix"><i class="com-ico"></i><span>';
                    if(commentData[i].sonComment.length > 0) {
                        str += commentData[i].sonComment.length;
                    } else {
                        str += '评论';
                    }
                    var str2 = '</span></span> ' +
                        '<span class="thumb-btn clearfix"><i class="thumb';
                    var str3 = '0';
                    var s = commentData[i].thumb.some(function(value,index,arr){
                        return value._id==user._id;
                    })

                    if(loginsign){
                        if(s){
                            str3 = '1';
                        }
                    }
                    var str4 = '-ico"></i><span>';
                    var str5 = '点赞';
                    if(commentData[i].thumb.length>0){
                        str5 = commentData[i].thumb.length;
                    }

                    var str6 = '</span></span>' +
                        '</div></div></div></div>';
                    str = str + str2+str3+str4+str5;
                    $(".comment .comment-ct").append(str);
                }
			}
		})
		//点赞
        $(".comment-ct").on('click', ' .item-inte .thumb-btn', function() { //购物车
            if(!isLogin()) {
                showLogin();
            } else {
                var index = $(this).parent().parent().parent().parent().attr('data-index');
                var state = $(this).children('i').hasClass('thumb0-ico');
                if(state) {//点赞
                    var user = JSON.parse(sessionStorage.user);
                    $(this).children('i').removeClass('thumb0-ico');
                    $(this).children('i').addClass('thumb1-ico');
                    commentData[index].thumb.push(user);
                    console.log(commentData);
                    $(this).children('span').text(commentData[index].thumb.length)

					$.ajax({
						type:'post',
						url:'/comment/addThumb',
						data:{
							uid:user._id,
							cid:commentData[index]._id
						},
						success:function(data){
							console.log(data)
						},error:function(data){
                            console.log(data)
						}
					})
                }
            }
        })



		//评论详情

		$(".comment-ct").on('click', ' .item-inte .com-btn', function() {
			var index = $(this).parent().parent().parent().parent().attr('data-index');
			var total = commentData[index].sonComment.length;
			var arr = commentData[index].sonComment;

			$(".comment .dt-main").empty();
			var s = '<div class="item" data-index=' + index + '>' +
				'<img src="' + commentData[index].uid.avatar + '" />' +
				'<div class="item-right clearfix">' +
				'<h4>' + commentData[index].uid.uname + '</h4>' +
				'<h5>(' + commentData[index].date.substring(0, 10) + ')</h5>' +
				'</div><h4 style="padding-left: 40px;">' + commentData[index].content + '</h4></div>'
			$(".comment .dt-main").append(s)
			$(".comment .son-cmt-hd span span").text(total);
			$(".comment .son-comment .item").remove()
			for(var i = 0; i < total; i++) {
				var str = '<div class="item">' +
                    '<img src="' + arr[i].uid.avatar + '" />' +
					'<div class="item-right clearfix">' +
					'<h4>' + arr[i].uid.uname + '</h4>' +'<h5>' + arr[i].date.substring(0, 10) + '</h5>'+
					'</div><h4 style="padding-left: 40px;">' + arr[i].content + '</h4></div>'
				$(".comment .son-comment").append(str)
			}

			$('body').addClass('overhide');
			$(".comment-dt").addClass('overscro')
			$(".comment-dt").animate({
				left: 0
			}, function() {})
		})

		$('.comment-dt .cross').click(function() {
			$('body').removeClass('overhide');
			$(".comment-dt").removeClass('overscro')
			$(".comment-dt").animate({
				left: '-100%'
			}, function() {

			})
		})
	}

	{
		//判断登录情况
		// $(".tot-ctr .good-btn a,.choice-box .good-btn a,.comment .item .item-inte span").click(function () {
		//     if (!isLogin()) {
		//         showLogin();
		//     } else {
		//         console.log('已经登录')
		//     }
		//
		// })

		addOnLoginListener(function(err, result) {
			if(!err) {
				isCollect();
				saveHistory();
				dismissLogin();

				getcartdata();
				toast('登陆成功')
			}
		})

	}

	{
		//收藏购物车购买
		$(".tot-ctr .collect").click(function() { //收藏
			if(!isLogin()) {
				showLogin();
			} else {
				if($(this).attr('data-type') == 0) {
					$.ajax({
						type: "post",
						url: "/collect/addcollect",
						async: true,
						data: {
							gid: goodInfo[0].gid._id
						},
						success: function(data) {
							console.log(data);
							if(data.flag == 200) {
								$(".tot-ctr .collect i").css('background-image', 'url(../../img/innisfreeIco/collect1.png)')
								$(".tot-ctr .collect").attr('data-type', '1')
                                toast("收藏成功")
							};

						}
					});

				} else if($(this).attr('data-type') == 1) {
					$.ajax({
						type: "post",
						url: "/collect/removecollect",
						async: true,
						data: {
							gid: goodInfo[0].gid._id
						},
						success: function(data) {
							console.log(data);
							if(data.flag == 200) {
								$(".tot-ctr .collect i").css('background-image', 'url(../../img/innisfreeIco/collect0.png)')
								$(".tot-ctr .collect").attr('data-type', '0')
                                toast("移除收藏")
							}
						}
					});
				}
			}

		})
		$(".choice-box .good-btn .add-car").click(function() { //购物车
			if(!isLogin()) {
				showLogin();
			} else {
				console.log(888)
				addcart()

			}
		})
		$(".tot-ctr .good-btn .add-car").click(function() {
			if(!isLogin()) {
				showLogin();
			} else {
				if($(".choice .right .good-tp").text() != '' && $(".choice .right .good-num").text() != '') {
					console.log(888)
					addcart()
				} else {
					toast("请先选择类别数量")
				}
			}
		})
		/*购买*/
		$(".tot-ctr .good-btn .buy").click(function() {
			if(!isLogin()) {
				showLogin();
			} else {
				if($(".choice .right .good-tp").text() != '' && $(".choice .right .good-num").text() != '') {
					console.log(888)

					/*     购买接口*/
					var index = $(".good-type ul .on").attr('data-typeindex');
					$.ajax({
						type: "post",
						url: "/order/addtocart",
						async: true,
						data: {
							uid: JSON.parse(sessionStorage.getItem("user"))._id,
							gid: goodInfo[0].gid._id,
							gsids: JSON.stringify([goodtype[index]._id]),
							num: $(".count .count-box .count-num").val()
						},
						success: function(result) {
							if(result.type == "success") {
								window.location.assign("/views/order/pay.html?otids=" + result.otid);
							} else {
								toast("购买失败")

							}
						}
					});
				} else {
					toast("请先选择类别数量")
				}
			}
		})
		$(".choice-box .good-btn .buy").click(function() { //购物车
			if(!isLogin()) {
				showLogin();
			} else {
				console.log(888)

				/*购买接口*/
				var index = $(".good-type ul .on").attr('data-typeindex');
				$.ajax({
					type: "post",
					url: "/order/addtocart",
					async: true,
					data: {
						uid: JSON.parse(sessionStorage.getItem("user"))._id,
						gid: goodInfo[0].gid._id,
						gsids: JSON.stringify([goodtype[index]._id]),
						num: $(".count .count-box .count-num").val()
					},
					success: function(result) {
						if(result.type == "success") {
							window.location.assign("/views/order/pay.html?otids=" + result.otid);
						} else {
							toast("购买失败")

						}
					}
				});
			}
		})
	}

	{
		//发布评论的评论
		$("#com-btn .subcom").click(function() {
			if(!isLogin()) {
				showLogin()
			} else {
				var content = $("#com-btn .com-input").val();
				var user = sessionStorage.user;
				var index = $(".comment-dt .dt-main .item").attr('data-index');
				$.ajax({
					type: "post",
					url: "/comment/addComToComment",
					data: {
						cid:commentData[index]._id,
						content: content
					},
					async: true,
					success: function(data) {
						console.log(data);
						$("#com-btn .com-input").val('');
						var user = JSON.parse(sessionStorage.user);
						var index = $(".comment-dt .dt-main .item").attr('data-index');
						data.data.uid = user;
						var str = '<div class="item">' +
							'<img src="' + data.data.uid.avatar + '" />' +
							'<div class="item-right clearfix">' +
							'<h4>' + data.data.uid.uname + '</h4>' +
							'<h5>(' + data.data.date.substring(0, 10) + ')</h5>' +
							'</div><h4 style="padding-left: 40px;">' + data.data.content + '</h4></div>'
						$(".comment .son-comment").append(str);
						commentData[index].sonComment.push(data.data);
						var d = $(".comment-ct .item[data-index='" + index + "'] .item-inte .com-btn span").text()
						console.log(parseInt(d))
						if(isNaN(parseInt(d))) {
							d = 1;
						} else {
							d = parseInt(d) + 1;
						}
						$(".comment-ct .item[data-index='" + index + "'] .item-inte .com-btn span").text(d);
						toast("评论成功")
					},
					error: function(data) {
						console.log(data);
					}
				});
			}

		})
	}

	{
		function reverse(i, n) {
			return function(q, w) {
				//			console.log(parseInt(q[n]))
				var a = parseInt(q[n]);
				var b = parseInt(w[n]);
				console.log(a + "-" + b)

				return(a - b)
			};
		}

		//数组对象排序
		var a = [{
			n: '15a'
		}, {
			n: '105a'
		}, {
			n: '25a'
		}];

		//		console.log(a.sort(reverse(1, 'n')))
	}

	function addcart() {
		var index = $(".good-type ul .on").attr('data-typeindex');
		$.ajax({
			type: "post",
			url: "/order/addtocart",
			data: {
				uid: JSON.parse(sessionStorage.getItem("user"))._id,
				gid: goodInfo[0].gid._id,
				gsids: JSON.stringify([goodtype[index]._id]),
				num: $(".count .count-box .count-num").val()
			},
			async: true,
			success: function(result) {
				console.log(result);

				$(".nav_cartnum").html(parseInt($(".nav_cartnum").html()) + 1);
				toast("添加成功")
			},
			error: function(err) {
				console.log(err);
			}
		});
	}

	function getcartdata() {
		var user = JSON.parse(sessionStorage.user);
		$.ajax({
			type: "get",
			url: "/order/getorderitembyuser/" + user._id + "/0",
			async: true,
			success: function(result) {
				console.log(result)
				if(result.type == "success") {
					//修改导航栏购物车商品数量
					console.log(result)
					$(".nav_cartnum").html(result.message.length);
				} else {
					//设置导航栏购物车商品数量为0
					$(".nav_cartnum").html("0");
					console.log(000)
				}

			},
			error: function(err) {
				//设置导航栏购物车商品数量为0
				$(".nav_cartnum").html("0");
				console.log(err);
			}
		});
	}

	function getGoodPhoto() {
		var gid = goodInfo[0].gid._id;
		console.log(gid)
		$.ajax({
			type: 'post',
			url: '/goodphoto/getPhotobygid',
			data: {
				gid: gid
			},
			async: true,

			success: function(data) {
				//绑定banner
				for(var i = 0; i < data.bannerImg.length; i++) {
					$(".good-ct .img-wrap").append('<img class="good-img center-block" src="/img/upload/' + data.bannerImg[i] + '" />')
					$(".good-ct .img-ctr").append('<span></span>');
				}
                $(".choice-box .choice-box-ct .left .good-img").attr('src','/img/upload/'+data.bannerImg[0])
				$(".good-ct .img-ctr span:first-of-type").addClass('on');
				//开启轮播
				var t = setTimeout(function() {
					lunbo();
					clearTimeout(t);
					t = setTimeout(arguments.callee, 3000);
				}, 1000)

				window.onblur = function() {
					clearTimeout(t);
				}
				window.onfocus = function() {
					setTimeout(function() {
						lunbo();
						clearTimeout(t);
						t = setTimeout(arguments.callee, 3000);
					}, 1000)
				};
				//加载详情图片

				$(".good-detail .detail-img").empty();
				$(".good-detail .detail-img").append('<img id="ddd" width="100%" src="/img/upload/' + data.infoImg[0] + '" />');
				$("#ddd")[0].onload = function() {
					ht = [];
					var ctP = $(".good-ct")[0].offsetTop;
					var detailP = $(".good-detail")[0].offsetTop - parseInt($(".good-ct").css('padding-top'));
					var commentP = $(".comment")[0].offsetTop - parseInt($(".good-ct").css('padding-top'));
					var mainlock = false; //控制主按钮的锁
					ht.push(ctP);
					ht.push(detailP);
					ht.push(commentP);
					console.log(ht)
				}

			},
			error: function(data) {
				console.log(data)
			}
		})
	}
})