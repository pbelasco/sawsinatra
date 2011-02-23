$(document).ready(function(){
	
	
	 Pusher.log = function() {
	    //  if (window.console) window.console.log.apply(window.console, arguments);
	    };

	    // Flash fallback logging - don't include this in production
	    //WEB_SOCKET_DEBUG = true;

	    var pusher = new Pusher('26eaaa68d90c2a0cf4a7');
	    var channel = pusher.subscribe('test_channel');
	    channel.bind('my_event', function(data) {
	      $("#posts").append("<div class ='message'><p>"+data+"</p></div>");
			$(".message:hidden:last").fadeIn(1000);
			var x = Math.random() * window.innerWidth;
			var y = Math.random() * window.innerHeight;
			console.log(x+", "+y);
			$(".message:last").css({
			"position": "absolute",
			"top": x+"px",
			"left": y+"px"	
			});
			$(".message:last").draggable();
		console.log(data);
	    });
		
	$("#say").click(function(event){
		
		//alert($("#sawmessage").val());	
		$.ajax({
		url: '/',
		type: 'POST',
		data:{'sawmessage':$("#sawmessage").val()},
		dataType: 'JSON',
		success:function(){alert("submitted");}
		});
		event.preventDefault();	
		return false;

	});
	
});