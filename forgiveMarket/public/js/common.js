function toast(content, url) {
	var html = '<div id="msg" style="font-size:1rem;z-index:9999;left: 5%;width: 90%;position: fixed;background:none;top:50%;"> <p class="msg" style="background: none repeat scroll 0 0 #000; border-radius: 30px;color: #fff; margin: 0 auto;padding: 1.5em;text-align: center;width: 70%;opacity: 0.8;"></p></div>';
	$(document.body).append(html);
	$("#msg").show();
	$(".msg").html(content);
	if(url) {
		window.setTimeout("location.href='" + url + "'", 1500);
	} else {
		setTimeout(function(){
			$("#msg").fadeOut()
		}, 500);
	}
}