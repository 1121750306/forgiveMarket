function toast(content, url) {
	var html = '<div id="msg" style="font-size:1rem;z-index:9999;left: 5%;width: 90%;position: fixed;background:none;top:50%;"> <p class="msg" style="background: none repeat scroll 0 0 #000; border-radius: 30px;color: #fff; margin: 0 auto;padding: 1.5em;text-align: center;width: 70%;opacity: 0.8;"></p></div>';
	$(document.body).append(html);
	$("#msg").show();
	$(".msg").html(content);
	if(url) {
		setTimeout(function(){location.assign(url);},1500);
	} else {
		setTimeout(function(){
			$("#msg").fadeOut(function(){
                $("#msg").remove();
            });
		}, 500);
	}
}

function isLogin(){
	var user = sessionStorage.user;
	if(user != null && user != 'null' && user != undefined && user != 'undefined' && user != ''){
		return true;
	}
	return false;
}

//加载白页控制
var wait;
function loadstart () {
	$(".loading").show();
	
	wait = setInterval(function(){
		var waitp = $(".loading p").html();
		if (waitp.substr(3).length < 3) {
			$(".loading p").html(waitp + ".");
		} else{
			$(".loading p").html("请稍候");
		}
	},500);
}

function loadcomplete () {
	clearInterval(wait);
	$(".loading").hide();
}

function loadfail () {
	clearInterval(wait);
	$(".loading p").html("点此刷新");
	$(".loading p").css("text-decoration","underline");
	$(".loading p").bind("click",function(){
		location.reload();
	});
	
}