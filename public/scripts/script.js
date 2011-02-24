$(document).ready(function(){
	
	var boardWidth = 4000;
	var boardHeight = 1000;
	
	//tag all items injected by couchDB as draggable
	
	$(".massage").draggable();
	
	$(".massage").live("dragstop", 
		
		function(){
		
				var position = $(this).position();
				//console.log($(this));
				console.log($(this).attr('id') + "stopped at "+position.left+" "+position.top);
				 //return function(position){
						$.ajax({
							url: '/locupdate',
							type: 'POST',
							data:{'id':$(this).attr('id'), 'newX':$(this).position().left, 'newY': $(this).position().top},
							dataType: 'JSON',
							success:function(){}
							});
				//	}
			
			
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
				      $("#posts").append("<div class ='justAdded massage startHidden' id = "+data["id"]+" ><p class = 'startHidden'>"+data['msg']+"</p></div>");
		
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
		var y = Math.random() * (boardHeight);
		console.log(x.toString() + "," + y.toString())
		//alert($("#sawmessage").val());	
		$.ajax({
		url: '/',
		type: 'POST',
		data:{'sawmessage':$("#sawmessage").val(), 'x':x.toString(), 'y':y.toString()},
		dataType: 'JSON',
		success:function(){alert("submitted");}
		});
		event.preventDefault();	
		return false;

	});
	
});