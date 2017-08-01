$(function(){
    function imgScale(className,time)//时间以秒为单位
    {
        // $(".img-wrap").on('click','.good-img',function(){
        //     console.log($('body').width());
        //     console.log($(window).height());
        //     $(this).css('width',$('body').width()+'px')
        // })
        var flag=0;
        console.log($(".qqqq"))
        $("body").on('click','.'+className,function(){
            if(flag){

                return false;
            }
            flag=1;
            console.log($(this).width()+'px');
            console.log($(window).scrollTop());
            // $(this).attr('width',$('body').width()+'px');
            var dic = $('body').width()/$(this).width();

            var tsX = -1*$(this).offset().left+($('body').width()-$(this).width())/2;
            var tsY = (-1*$(this).offset().top+$(window).scrollTop()+($(window).height()-$(this).height())/2);
console.log($(this).offset().top)
            // console.log(($(window).height()+$(this).height()))
         $('body').after('<div class="img-bg" style="width: 100%;z-index:1000;background:rgba(0,0,0,.6);height: 3000px;top: -500px;position: fixed"></div>')
            console.log(($(window).height()+$(this).height())/2);
            $(this).parent().css('display','relative')
            $(this).parent().css('z-index','3000')
            $(this).css("transition",'all '+time+'s')
            $(this).css('transform', 'translate('+tsX+'px,'+tsY+'px)'+'scale('+dic+') ');
            $(this).css('border','0')
            $('body').addClass('overhide');
            $('body').removeClass('overauto');
            setTimeout(function(){
                console.log(".qqqq");
                $(".img-bg").click(function(){
                console.log(888);

                $(this).remove();
                $('.'+className).css('transform','');
                $('body').addClass('overauto');
                $('body').removeClass('overhide');
                setTimeout(function(){
                	$('.'+className).parent().css('z-index','auto');
                    flag = false;
                },time*1000)
            })
            },time*1000)

        })
    }
    imgScale('qqqq',0.7)

})


