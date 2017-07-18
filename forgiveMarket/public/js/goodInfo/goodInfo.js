/**
 * Created by wanganyu on 2017/7/13.
 */
$(function () {
    {
        var goodInfo;
        var goodtype;
        var url = location.search;
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

                    var typeindex = $(".good-type .on").attr('data-typeindex');
                    $(".choice-box .type-price span").text((goodInfo[0].gid.pricebase+goodtype[typeindex].priceoffset))
                    $(".choice-box .type-lefts span").text(goodtype[typeindex].lefts)


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
        $(".choice-box .good-type").on('click','li',function () {
            $(".choice-box .good-type li").removeClass("on");
            $(this).addClass('on');

            var typeindex = $(this).attr('data-typeindex');
            $(".choice-box .type-price span").text((goodInfo[0].gid.pricebase+goodtype[typeindex].priceoffset))
            $(".choice-box .type-lefts span").text(goodtype[typeindex].lefts);
            $(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text()*parseInt($(".count-box .count-num").val()))

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

       var t =  setTimeout(function(){
            lunbo();
            clearTimeout(t);
            t = setTimeout(arguments.callee,3000);
        }, 3000)
    }

    //模态框事件
    $(".choice").click(function () {
        $("#choice-bg").css('display', 'block');
        $(".choice-box").css('display', 'block');
        $(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text()*parseInt($(".count-box .count-num").val()))
        $(".choice-box").animate({
            bottom: '0'
        }, '300')
    })
    $("#choice-bg").click(function (e) {
        $(".choice-box").animate({
            bottom: '-500px'
        }, '300', function () {
            $(".choice-box").css('display', 'none');
            $("#choice-bg").css('display', 'none')
            return false;
        })
    })
    $(".choice-box .cross span").click(function () {
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
        $(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text()*parseInt($(".count-box .count-num").val()))

    })
    $(".count-box .ctr-add").click(function () {
        if (Number($(".count-box .count-num").val()) < c) {
            $(".count-box .count-num").val(Number($(".count-box .count-num").val()) + 1)
        }
        $(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text()*parseInt($(".count-box .count-num").val()))

    })
    $(".count-box .count-num").change(function () {
        checkCount();
        if($(".count-box .count-num").val()==''){
            $(".count-box .count-num").val('1');
        };
        $(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text()*parseInt($(".count-box .count-num").val()))

    })
    $(".count-box .count-num").keyup(function () {
        checkCount();
        $(".box-total .right span,.total-price .right span").text($(".choice-box-ct .right .type-price span").text()*parseInt($(".count-box .count-num").val()))

    })

    function checkCount() {
        if($(".count-box .count-num").val()!=''){
            $(".count-box .count-num").val($(".count-box .count-num").val().replace(/[^\d]/g, ''))
            console.log(Number($(".count-box .count-num").val()))
            if (Number($(".count-box .count-num").val()) > c) {
                $(".count-box .count-num").val(c)
            } else if (Number($(".count-box .count-num").val()) < 1) {
                $(".count-box .count-num").val(1)
            }
        }
    }
    function changeTotal(){
        $(".box-total")
    }

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
        //收藏购物车购买
        $(".tot-ctr .collect").click(function () {
            /*

             * */
            if ($(this).attr('data-type') == 0) {
                $(".tot-ctr .collect i").css('background-image', 'url(../../img/innisfreeIco/collect1.png)')
                $(this).attr('data-type', '1')
            }
            else if ($(this).attr('data-type') == 1) {
                $(".tot-ctr .collect i").css('background-image', 'url(../../img/innisfreeIco/collect0.png)')
                $(this).attr('data-type', '0')
            }
        })

    }

})