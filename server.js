#!/usr/bin/env node

// http://blog.modulus.io/build-your-first-http-server-in-nodejs

var http   = require('http');
const PORT = 9998;

var messageCount = 0; 
var maxMessages = 10; 
var messages =[]; 

send_header = function (response) {
    response.writeHead(200, {'Content-Type': 'application/json',
                             'Access-Control-Allow-Origin': '*',
                             'Access-Control-Allow-Methods': 'GET,POST'});
}

// handlers
handler_get = function (request, response) {
    send_header(response);
    response.end(JSON.stringify(messages));
};

handler_post = function (request, response) {
    request.on('data', function(data) {
		
        console.log('Messeage posted: '+data);
		if (messageCount >= maxMessages)
		{
			messages.shift(); 
		}
		messages.push( String(data));	//Must be cast to String - else read as ascii 
		messageCount++; 
		
        send_header(response);
        response.end(JSON.stringify(3));
    });
};

dispatch = {
    'GET':     handler_get,
    'POST':    handler_post
};

var server = http.createServer(function (request, response){
    console.log(request['method']+' '+request.url);
    dispatch[request['method']](request, response);
});
server.listen(PORT, function(){
    console.log("Listening to http://localhost:%s", PORT);
});

