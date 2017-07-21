function getTopSix(callback) {
	$.ajax({
		type: "post",
		url: "/users/gettopgoods",
		async: true,
		success: function(data) {
			callback(data, null);
		},
		fail:function(err){
			callback(null, err);
		}
	});
}