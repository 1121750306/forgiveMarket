/**
 * Created by wanganyu on 2017/7/13.
 */
$(function () {
    var c = 35;//假设库存为35
//模态框事件
    $(".choice").click(function () {
        $("#choice-bg").css('display', 'block')
        $(".choice-box").css('display', 'block')
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
    //数量增加事件
    $(".count-box .ctr-sub").click(function(){
        if(Number($(".count-box .count-num").val())>1){
            $(".count-box .count-num").val(Number($(".count-box .count-num").val())-1)
        }
    })
    $(".count-box .ctr-add").click(function(){
        if(Number($(".count-box .count-num").val())<c){
            $(".count-box .count-num").val(Number($(".count-box .count-num").val())+1)
        }
    })
    $(".count-box .count-num").change(function(){
        checkCount();
    })
    function checkCount(){
        $(".count-box .count-num").val( $(".count-box .count-num").val().replace(/[^\d]/g,''))
        console.log(Number($(".count-box .count-num").val()))
        if(Number($(".count-box .count-num").val())>c){
            $(".count-box .count-num").val(c)
        }else if(Number($(".count-box .count-num").val())<1){
            $(".count-box .count-num").val(1)
        }
    }
})