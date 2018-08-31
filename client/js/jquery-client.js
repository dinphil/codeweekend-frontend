var infoColor = '#888888';
var errorColor = 'red';
var messageColor = '#000000';
var nameColor = 'blue';

var messagesAreHidden = false;

var formatMessage = function(user, message) {
	return '<span style="color: ' + nameColor + '">' + 
		user + '</span>' + ': ' + message;
};

var postMessage = function(color, contents) {
	console.log("jquery is not ready yet");
}


$(function() {
	postMessage = function(color, contents) {
		$('<li><span style="color: ' + color + '">'
			+ contents + '</span></li>')
		.hide()
		.appendTo('#messages')
		.fadeIn(200);
	}


	$('#message-form').submit(function(event) {
		event.preventDefault();

		if($('#message').val() !== '') {
			//postMessage('black', formatMessage('Me', $('#message').val()));
            sendMessage($('#message').val()); // server messaging
			$('#message').val('');
		}
	});

	$('#submit-button').click(function(event) {
		$('#message-form').submit();
	});

	$('#clear-button').click(function(event) {
		$('#messages').empty();
	});

	$('#toggle-hide').click(function(event) {
		if(messagesAreHidden) {
			$('#messages').show();
			messagesAreHidden = false;
			$('#toggle-hide').text('Hide messages');
		} else {
			$('#messages').hide();
			messagesAreHidden = true;
			$('#toggle-hide').text('Show messages');
		}
	})


	$('body').keypress(function(event) {
		console.log(event.which);

		if(event.which == 13) {
			$('#message-form').submit();
			event.preventDefault();
		}

	});

	/*var x = 1;
	setInterval(function() {
		x = x + 0.1;
		$('h1').css('margin-top', Math.sin(x) * 20);
		$('h1').css('font-size', Math.sin(x) * 20);
	}, 50);*/

	
});