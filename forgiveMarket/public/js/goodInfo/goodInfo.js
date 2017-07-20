/**
 * Created by wanganyu on 2017/7/13.
 */
$(function () {

    {
        var goodInfo;
        var goodtype;
        var url = location.search;
        alert(5)
        if (url != '') {
            url = url.substring(1);
            var gid = url.split('&')[0].split('=')[1];
            console.log(gid);
            $.ajax({
                type: "get",
                url: "/goodInfo/" + gid,
                async: true,
                success: function (data) {
                    console.log(data);
                    goodInfo = data.info;
                    goodtype = data.type;
                    console.log(goodtype.sort(reverse(1, 'gsname')))
                    /*修改数据*/
                    $(".good-name").text(goodInfo[0].gid.gname);
                    $(".good-usage").text(goodInfo[0].usage);
                    $(".good-fitwhere").text(goodInfo[0].fitwhere);
                    for (var i = 0; i < goodtype.length; i++) {
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

                    if (isLogin()) {
                        console.log(5);
                        saveHistory();
                        isCollect();
                        getcartdata()
                    }

                    /*
                     重新渲染
                     * */

                    $("#load").css('display', 'none');
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
                success: function (data) {
                    if (data.flag == 200) {
                        console.log("历史记录添加成功");
                    } else {
                        console.log("历史记录添加出错")
                    }
                },
                error: function () {
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
                success: function (data) {
                    console.log(data)
                    if (data.flag == 200) {
                        $(".tot-ctr .collect i").css('background-image', 'url(../../img/innisfreeIco/collect1.png)')
                        $(".tot-ctr .collect").attr('data-type', '1')
                    } else if (data.flag == 300) {
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
    $(window).scroll(function (e) {
        var t = $(document).scrollTop();
        for (var i = 0; i < ht.length; i++) {
            if (t > ht[i]) {
                $("#main-ctr .ctrbtn").removeClass("on");
                $("#main-ctr .ctrbtn").eq(i).addClass('on');
            }
        }
    })

    //切换事件
    $("#main-ctr .ctrbtn").click(function () {
        // $("#main-ctr .ctrbtn").removeClass("on");
        // $(this).addClass('on');
        if (!mainlock) {
            mainlock = true;
            var index = $("#main-ctr .ctrbtn").index($(this));
            console.log(ht[index] + 2 + "px");
            $('body').animate({
                scrollTop: ht[index] + 2
            }, function () {
                mainlock = false;
            })
        }

    })

    {
        $(".choice-box .good-type").on('click', 'li', function () {
            $(".choice-box .good-type li").removeClass("on");
            $(this).addClass('on');

            var typeindex = parseInt($(this).attr('data-typeindex'));
            if (Number($(".count-box .count-num").val()) > goodtype[typeindex].lefts) {
                $(".count-box .count-num").val(goodtype[typeindex].lefts)
            }

            $(".choice-box .type-price span").text((goodInfo[0].gid.pricebase + goodtype[typeindex].priceoffset))
            $(".choice-box .type-lefts span").text(goodtype[typeindex].lefts);
            $(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text() * parseInt($(".count-box .count-num").val()))

        })

    }

    //图片轮播
    {
        function lunbo() {
            var imgNum = $(".good-ct .img-ctr").children().length;
            var preIndex = $(".ct-imgList .img-ctr span").index($(".ct-imgList .img-ctr .on"));
            var nowIndex;
            if (preIndex >= imgNum - 1) {
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
    $(".choice").click(function () {
        $("#choice-bg").css('display', 'block');
        $(".choice-box").css('display', 'block');
        $(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text() * parseInt($(".count-box .count-num").val()))
        $(".choice-box").animate({
            bottom: '0'
        }, '300')

    })
    $("#choice-bg").click(function (e) {
        $(".choice .right span").eq(0).text($(".good-type ul .on span").text() + " * ")
        $(".choice .right .good-num").text($(".count .count-box .count-num").val());
        console.log($(".count .count-box .count-num").val() + "p")
        $(".choice-box").animate({
            bottom: '-500px'
        }, '300', function () {
            $(".choice-box").css('display', 'none');
            $("#choice-bg").css('display', 'none')
            return false;
        })
    })
    $(".choice-box .cross span").click(function () {
        $(".choice .right .good-tp").text($(".good-type ul .on span").text() + "*");
        console.log($(".count .count-box .count-num").val() + "p")
        $(".choice .right .good-num").text($(".count .count-box .count-num").val());
        $(".choice-box").animate({
            bottom: '-500px'
        }, '300', function () {
            $(".choice-box").css('display', 'none');
            $("#choice-bg").css('display', 'none')
            return false;
        })
    })
    //数量增加事件
    $(".count-box .ctr-sub").click(function () {
        if (Number($(".count-box .count-num").val()) > 1) {
            $(".count-box .count-num").val(Number($(".count-box .count-num").val()) - 1)
        }
        $(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text() * parseInt($(".count-box .count-num").val()))

    })
    $(".count-box .ctr-add").click(function () {
        var index = $(".good-type ul .on").attr('data-typeindex');
        if (Number($(".count-box .count-num").val()) < goodtype[index].lefts) {
            $(".count-box .count-num").val(Number($(".count-box .count-num").val()) + 1)
        }
        $(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text() * parseInt($(".count-box .count-num").val()))

    })
    $(".count-box .count-num").change(function () {
        checkCount();
        if ($(".count-box .count-num").val() == '') {
            $(".count-box .count-num").val('1');
        }
        ;
        $(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text() * parseInt($(".count-box .count-num").val()))

    })
    $(".count-box .count-num").keyup(function () {
        checkCount();
        if ($(".count-box .count-num").val() != '') {
            $(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text() * parseInt($(".count-box .count-num").val()))
        }
    })

    function checkCount() {
        var index = parseInt($(".good-type ul .on").attr('data-typeindex'));
        if ($(".count-box .count-num").val() != '') {
            $(".count-box .count-num").val($(".count-box .count-num").val().replace(/[^\d]/g, ''))
            console.log(Number($(".count-box .count-num").val()))
            if (Number($(".count-box .count-num").val()) > goodtype[index].lefts) {
                $(".count-box .count-num").val(goodtype[index].lefts)
            } else if (Number($(".count-box .count-num").val()) < 1) {
                $(".count-box .count-num").val(1)
            }
        }
    }

    //
    // function changeTotal() {
    // 	$(".box-total")
    // }

    {
        //评论详情
        $(".item-inte .com-btn").click(function () {
            $('body').addClass('overhide');
            $(".comment-dt").addClass('overscro')
            $(".comment-dt").animate({
                left: 0
            }, function () {
            })
        })
        $('.comment-dt .cross').click(function () {
            $('body').removeClass('overhide');
            $(".comment-dt").removeClass('overscro')
            $(".comment-dt").animate({
                left: '-100%'
            }, function () {

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


        addOnLoginListener(function (err, result) {
            if (!err) {
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
        $(".tot-ctr .collect").click(function () {//收藏
            if (!isLogin()) {
                showLogin();
            } else {
                if ($(this).attr('data-type') == 0) {
                    $.ajax({
                        type: "post",
                        url: "/collect/addcollect",
                        async: true,
                        data: {
                            gid: goodInfo[0].gid._id
                        },
                        success: function (data) {
                            console.log(data);
                            if (data.flag == 200) {
                                $(".tot-ctr .collect i").css('background-image', 'url(../../img/innisfreeIco/collect1.png)')
                                $(".tot-ctr .collect").attr('data-type', '1')
                            }
                        }
                    });

                } else if ($(this).attr('data-type') == 1) {
                    $.ajax({
                        type: "post",
                        url: "/collect/removecollect",
                        async: true,
                        data: {
                            gid: goodInfo[0].gid._id
                        },
                        success: function (data) {
                            console.log(data);
                            if (data.flag == 200) {
                                $(".tot-ctr .collect i").css('background-image', 'url(../../img/innisfreeIco/collect0.png)')
                                $(".tot-ctr .collect").attr('data-type', '0')
                            }
                        }
                    });
                }
            }

        })
        $(".choice-box .good-btn .add-car").click(function () {//购物车
            if (!isLogin()) {
                showLogin();
            } else {
                    console.log(888)
                    addcart()

            }
        })
        $(".tot-ctr .good-btn .add-car").click(function(){
            if (!isLogin()) {
                showLogin();
            } else {
                if($(".choice .right .good-tp").text()!=''&&$(".choice .right .good-num").text()!=''){
                    console.log(888)
                    addcart()
                }else{
                    toast("请先选择类别数量")
                }
            }
        })
        /*购买*/
        $(".tot-ctr .good-btn .buy").click(function(){
            if (!isLogin()) {
                showLogin();
            } else {
                if($(".choice .right .good-tp").text()!=''&&$(".choice .right .good-num").text()!=''){
                    console.log(888)

                    /*     购买接口*/

                }else{
                    toast("请先选择类别数量")
                }
            }
        })
        $(".choice-box .good-btn .buy").click(function () {//购物车
            if (!isLogin()) {
                showLogin();
            } else {
                console.log(888)

                /*购买接口*/

            }
        })
    }

    {
        function reverse(i, n) {
            return function (q, w) {
                //			console.log(parseInt(q[n]))
                var a = parseInt(q[n]);
                var b = parseInt(w[n]);
                console.log(a + "-" + b)

                return (a - b)
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
            success: function (result) {
                console.log(result);

                $(".nav_cartnum").html(parseInt($(".nav_cartnum").html()) + 1)
            },
            error: function (err) {
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
            success: function (result) {
            	console.log(result)
                if (result.type == "success") {
                    //修改导航栏购物车商品数量
                    console.log(result)
                    $(".nav_cartnum").html(result.message.length);
                } else {
                    //设置导航栏购物车商品数量为0
                    $(".nav_cartnum").html("0");
                    console.log(000)

                }

            },
            error: function (err) {
                //设置导航栏购物车商品数量为0
                $(".nav_cartnum").html("0");
                console.log(err);
            }
        });
    }
    function getGoodPhoto(){
        var gid = goodInfo[0].gid._id;
        console.log(gid)
        $.ajax({
            type:'post',
            url:'/goodphoto/getPhotobygid',
            data:{
                gid:gid
            },
            async:true,

            success:function(data){
                //绑定banner
                for(var i = 0;i<data.bannerImg.length;i++){
                    $(".good-ct .img-wrap").append('<img class="good-img center-block" src="/img/upload/'+data.bannerImg[i]+'" />')
                    $(".good-ct .img-ctr").append('<span></span>');
                }
                $(".good-ct .img-ctr span:first-of-type").addClass('on');
                //开启轮播
                var t = setTimeout(function () {
                    lunbo();
                    clearTimeout(t);
                    t = setTimeout(arguments.callee, 3000);
                }, 1000)

                window.onblur = function () {
                    clearTimeout(t);
                }
                window.onfocus = function () {
                    setTimeout(function () {
                        lunbo();
                        clearTimeout(t);
                        t = setTimeout(arguments.callee, 3000);
                    }, 1000)
                };
                //加载详情图片
                $(".good-detail .detail-img").empty();
                $(".good-detail .detail-img").append('<img id="ddd" width="100%" src="/img/upload/'+data.infoImg[0]+'" />');
                $("#ddd")[0].onload = function(){
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
            error:function(data){
                console.log(data)
            }
        })
    }
})