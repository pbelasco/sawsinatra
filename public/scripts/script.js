$(document).ready(function(){

  var boardWidth = 10000;
  var boardHeight = 500;
  //tag all items injected by couchDB as draggable
  var messages = 	$(".massage");
  messages.draggable();
	
/*
  //skew notes randomly, currently disabled
  messages.each(function(){
    var num = -10 + Math.random() * 20; 
    $(this).css("-webkit-transform","rotate("+num+"deg)");
    $(this).css("-moz-transform","rotate("+num+"deg)");
  });*/
  
	//if user has ID stored in localStorage, see if he has any replies
	var userid = localStorage.getItem("userid");
	if(userid!=null){
    //TODO: query database and return a all messages user has recieved
  }
  //once user stops dragging, generate a new message to send to the server with the location of the newly moved note
  messages.live("dragstop", 
    function(){
      var elem = $(this);
      var position = elem.position();
      //console.log($(this));
      //console.log($(this).attr('id') + "stopped at "+position.left+" "+position.top);
      (function(position, elem){
        $.ajax({
          url: '/locupdate',
          type: 'POST',
          data:{'id':elem.attr('id'), 'newX':position.left, 'newY': position.top},
          dataType: 'JSON',
          success:function(){}
          });
        })(position,elem);
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
  var pusher = new Pusher('26eaaa68d90c2a0cf4a7'),
   channel = pusher.subscribe('test_channel');
   // bind the message(generated by the server) newpost to the channel. whenever a new post is posted by any user
   // all users subscribed to that channel will get the following. Here's what it does:
   // 1. It creates an exact replica of the post tha tthe user wrote and is now stored in the database
   // 2. It appends it to the page at the location where it was randomly generated at the user's end
   // 3. It scrolls the viewport to the location of recently added message, and fades it in
   // 4. Finally, it makes the newly added message draggable.
   // 5. Profit?
  channel.bind('new_post', function(data) {
    var x = data['x'], y = data['y'];
    $("#posts").append("<div class ='justAdded massage startHidden' id = "+data["id"]+" ><p class = 'startHidden'>"+data['msg']);//+"</p><input class = 'reply' type='submit' value='Reply' /></div>"
    $(".massage:hidden:last").fadeIn(1000);
    $(".massage:last").css({
      "position": "absolute",
      "top": y+"px",
      "left": x+"px"});
    $.scrollTo($(".massage:last"), 1600, {zIndex: 2700, offset:-50, onAfter:function(){$(".massage:last p").fadeIn(1000);}});
    $(".massage:last").draggable({
      start: function(){ $(this).removeClass('justAdded')}
      });
    });
    //similarly, when any user moves a note, this message is generated so that the newly changed position is broadcast everywhere
    channel.bind('locupdate', function(data) {
    //console.log("got new position! " + data.id);
    $("#"+data.id).animate({
      top: data.y,
      left: data.x}, 500);
    });
    
    // this is the event that actually generates the message and sends it to the server. Note that it doesn't add the message client side
    // that is done through the pusher event, to which the originator of the message is also subscribed to. Here's what it does:
    // 1. Generates a random (x, y) pair for the location of the message
    // 2. Checks for userId, if there is one stored in localStorage, then use that, otherwise geberate a new one based on the current date
    // 3. Create a payload which consists of the contents of the <textarea> which is the actual message, the userID and the (x, y) values
    // 4. It then stores the userID in localStorage and prevents the <form> from being submitted
    // 5. Profit??
    $("#say").click(function(event){
      var x = Math.random() * (boardWidth), 
        y = 50 + Math.random() * (boardHeight - 50),
        userid = localStorage.getItem("userid");
      //console.log(x.toString() + "," + y.toString())
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
    
  // clear the messages client side  
  $("#clear").click(function(event){
    var postsDiv = $("#posts");
    postsDiv.fadeOut(2000, function(){
      postsDiv.html("");
      postsDiv.fadeIn();
    });
    return false;
  });
  // TODO: actually implement the reply functionality
  // currently this is what it does:
  // 1. Sets the userId of the replier, if the replier has also posted before use that ID
  // 2. Create a payload that currently exists of a dummy message, the userId of the recipient(which is also the id of the div of the original message),
  //   and the userID of the sender
  // 3. Sends the payload to '/reply' and 
  // 4. Stores the userId of the replier in his localStorage
  // 5. Profit???
  $(".reply").live("click", function(){
    var parentDiv = $(this).parent(),
      userid = localStorage.getItem("userid");
    //console.log(parentDiv);
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