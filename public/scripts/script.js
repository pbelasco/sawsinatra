$(document).ready(function(){

	var boardWidth = 10000;
	var boardHeight = 500;
	
	//tag all items injected by couchDB as draggable
	var messages = 	$(".massage");
	messages.draggable();
	
/*	messages.each(function(){
		var num = -10 + Math.random() * 20; 
		$(this).css("-webkit-transform","rotate("+num+"deg)");
		$(this).css("-moz-transform","rotate("+num+"deg)");
		});*/

	
	//if user has ID stored in localStorage, see if he has any replies
	var userid = localStorage.getItem("userid");
	if(userid!=null){
		
		
	}
	
	messages.live("dragstop", 
		
		function(){
		
				var elem = $(this);
				var position = elem.position();
				//console.log($(this));
				console.log($(this).attr('id') + "stopped at "+position.left+" "+position.top);
				  (function(position, elem){
						$.ajax({
							url: '/locupdate',
							type: 'POST',
							data:{'id':elem.attr('id'), 'newX':position.left, 'newY': position.top},
							dataType: 'JSON',
							success:function(){}
							});
				})(position,elem)
			
			
	}
	
	);
	
	$("#bottom").draggable({handle:"#button"});
	
	
	$("#button").dblclick(function(){
		
		$("#myForm").toggle(1000);
		
		
	});
	
	
	 Pusher.log = function() {
	    //  if (window.console) window.console.log.apply(window.console, arguments);
	    };

	    // Flash fallback logging - don't include this in production
	    //WEB_SOCKET_DEBUG = true;

	    var pusher = new Pusher('26eaaa68d90c2a0cf4a7');
	    var channel = pusher.subscribe('test_channel');
	    channel.bind('my_event', function(data) {
					var x = data['x'];
					var y = data['y'];
				      $("#posts").append("<div class ='justAdded massage startHidden' id = "+data["id"]+" ><p class = 'startHidden'>"+data['msg']);//+"</p><input class = 'reply' type='submit' value='Reply' /></div>"
		
						$(".massage:hidden:last").fadeIn(1000);
					
						$(".massage:last").css({
						"position": "absolute",
						"top": y+"px",
						"left": x+"px"	
						});
			
					$.scrollTo($(".massage:last"), 1600, {zIndex: 2700, offset:-50, onAfter:function(){$(".massage:last p").fadeIn(1000);}});
			
						$(".massage:last").draggable({
							start: function(){ $(this).removeClass('justAdded')}
						});				
	    });
	
	
		channel.bind('locupdate', function(data) {
			console.log("got new position! " + data.id);
			$("#"+data.id).animate({
				top: data.y,
				left: data.x
			}, 500);
			
		});
		
		
	$("#say").click(function(event){
		var x = Math.random() * (boardWidth);
		var y = 50 + Math.random() * (boardHeight - 50);
		console.log(x.toString() + "," + y.toString())
		var userid = localStorage.getItem("userid");
		if(userid === null){
			userid = Date.now().toString() + (Math.random() * 0x100000000).toString();
		}
		//alert($("#sawmessage").val());	
		$.ajax({
		url: '/',
		type: 'POST',
		data:{'userid':userid, 'sawmessage':$("#sawmessage").val(), 'x':x.toString(), 'y':y.toString()},
		dataType: 'JSON',
		success:function(){alert("submitted");}
		});
		
		localStorage.setItem("userid", userid)
		event.preventDefault();	
		return false;

	});
	
	$("#clear").click(function(event){
		
		var postsDiv = $("#posts");
		postsDiv.fadeOut(2000, function(){
			postsDiv.html("");
			postsDiv.fadeIn();
		});
	
		return false;
	

	});
	
	
	$(".reply").live("click", function(){
		
		var parentDiv = $(this).parent();
		
		console.log(parentDiv);
		
	
		if(userid === null){
			userid = Date.now().toString() + (Math.random() * 0x100000000).toString();
		}
		
		var payload = {'receiverId': parentDiv.attr('id').toString(), 'msg': "hi there, extending the reply message so that it spans multiple lines and then I can see the rules on the paper", 'senderId':userid};
		
			$.ajax({
			url: '/reply',
			type: 'POST',
			data: payload,
			dataType: 'JSON',
			success:function(){
				
				/*parentDiv.append("<div class='replyPost'><p>" + payload.msg + "</p></div>" );*/
				localStorage.setItem("userid", userid)
				
			}
			});
		
	});
	
});