$(function(){
    {
        // $(".img-wrap").on('click','.good-img',function(){
        //     console.log($('body').width());
        //     console.log($(window).height());
        //     $(this).css('width',$('body').width()+'px')
        // })
        var flag=0;
        console.log($(".qqqq"))
        $("body").on('click','.qqqq',function(){
            if(flag){
                return false;
            }
            flag=1;
            console.log($(this).width()+'px');
            console.log($(window).scrollTop());
            // $(this).attr('width',$('body').width()+'px');
            var dic = $('body').width()/$(this).width();

            var tsX = ($('body').width()-$(this).width())/2;
            var tsY = (-1*$(this).offset().top+$(window).scrollTop()+($(window).height()-$(this).height())/2);
console.log($(this).offset().top)
            // console.log(($(window).height()+$(this).height()))
//          $('body').after('<div class="img-bg" style="width: 100%;z-index:1000;background:#ccc;height: 3000px;top: -500px;position: fixed"></div>')
            console.log(($(window).height()+$(this).height())/2);
            $(this).parent().css('display','relative')
            $(this).parent().css('z-index','3000')
            $(this).css("transition",'all 1.5s')
            $(this).css('transform', 'translate('+tsX+'px,'+tsY+'px)'+'scale('+dic+') ');
            setTimeout(function(){
                console.log(".qqqq");
                $('body').addClass('overhide');
                $(".img-bg").click(function(){
                    console.log(888);

                    $(this).remove();
                    $(".qqqq").css('transform','');
                    $(".qqqq").parent().css('z-index','1');
                    setTimeout(function(){
                        flag = false;
                    },1500)
                    // event.stopPropagation()
                })
            },1500)

        })
    }


})


