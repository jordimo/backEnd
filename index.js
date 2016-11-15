
var express = require('express');
var app 	= express();
var http 	= require('http').Server(app);
var io 		= require('socket.io')(http);
var path 	= require('path');



var port  =  3000;

var SOCKETS = [];


app.set('port', port);

app.use(express.static(path.join(__dirname, '/public')));

app.get('/meyaHook', function (req, res)
{
	console.log("message from robot");
    console.log(req.query.uid);

    web_useId = 	req.query.uid;
    web_action = 	req.query.webaction;
    web_data = 		req.query.webdata;

    if (SOCKETS[req.query.uid])
    {
        SOCKETS[req.query.uid].emit('webaction', {action: web_action, data: web_data});
        res.status(200);
    } else {
        res.status(400);
    }

    res.send();

});




// ---- CONNECTING


io.on('connection', function (socket) {

	socket.on('set user id', function (data) {

		SOCKETS[data.userId]  = socket;
		socket.___userId = data.userId
		console.log("user connected", socket.___userId);
	});

	socket.on('disconnect', function () {
		delete SOCKETS[socket.___userId];
    	io.emit('user disconnected');
    	console.log("user disconnected" , socket.___userId);
  	});
});


http.listen(port, function() {
	console.log('server running on port', port);
});
