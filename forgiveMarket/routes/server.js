var WebSocket = require('ws');
var WebSocketServer=WebSocket.Server;
wws=new WebSocketServer({port:8181});
var express = require('express');
var router = express.Router();
var clients = [];
var userTemp;
function wsSend(type,client_uuid, nickname, avatar,message) {
    for (var i = 0; i < clients.length; i++) {
        var clientSocket = clients[i].ws;
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({
            	"type":type,
                "id": client_uuid,
                "nickname": nickname,
                "avatar":avatar,
                "message": message
            }));
        }
    }
}
wws.on("connection",function(ws){
		ws.on("message",function(message){
			 console.log("len"+clients.length);
			if(message.indexOf("/user")===0){
				console.log("message"+message.split(" ")[1]);
				userTemp=JSON.parse(message.split(" ")[1]);
				console.log(userTemp);
				var exist=false;
				for(var i=0;i<clients.length;i++){
					if(clients[i].id==userTemp._id){
						exist=true;
					}
				}
				if(!exist){
					clients.push({"id":userTemp._id,"nickname":userTemp.uname,"avatar":userTemp.avatar,"ws":ws});
			    	wsSend("init",userTemp._id,userTemp.uname,userTemp.avatar,"");
				}
			}else{
				var id=message.split("|")[0];
				var nickname,avatar;
				for(var i=0;i<clients.length;i++){
					if(clients[i].id==id){
						console.log("zhaodaole"+clients[i].id);
						nickname=clients[i].nickname;
						avatar=clients[i].avatar;
						wsSend("message",id,nickname,avatar,message.split("|")[1]);
					}
				}
			}
				/*wsSend(client_uuid, nickname, message);*/
		});
		
		ws.on('close',function(code,id){
			console.log("code"+code+"==="+id);
			console.log("zhaodaole"+clients.length);
			for(var i=0;i<clients.length;i++){
					if(clients[i].id==id){
						console.log("zhaodaole"+clients[i].id);
				        clients.splice(i,1);
				        
					} 
				}
		})
	})

module.exports = router;
