$(function(){
	$.ajax({
		type:"get",
		url:"/comment/getgoodComment",
		async:true,
		success:function(data){
			console.log(data);
		},
		error:function(data){
			console.log(data)
		}
	});
	
	
})
