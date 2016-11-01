#!/usr/bin/env node

// http://blog.modulus.io/build-your-first-http-server-in-nodejs

var http   = require('http');
const PORT = 9998;

var messageCount = 0; 
var messages =["Johan", "Chris"]; 

send_header = function (response) {
    response.writeHead(200, {'Content-Type': 'application/json',
                             'Access-Control-Allow-Origin': '*',
                             'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'});
}

// handlers
handler_get = function (request, response) {
    send_header(response);
    response.end(JSON.stringify(messages));
};
handler_put = function (request, response) {
    request.on('data', function(data) {
        console.log(''+data);
        send_header(response);
        response.end(JSON.stringify(3));
    });
};
handler_post = function (request, response) {
    request.on('data', function(data) {
		
        console.log('Messeage posted: '+data);
		messages.push( String(data));	//Must be cast to String - else read as ascii 
		
        send_header(response);
        response.end(JSON.stringify(3));
    });
};
handler_delete = function (request, response) {
    send_header(response);
    response.end(JSON.stringify(4));
};
handler_options = function (request, response) {
    send_header(response);
    response.end(null);
};

dispatch = {
    'GET':     handler_get,
    'PUT':     handler_put,
    'POST':    handler_post,
    'DELETE':  handler_delete,
    'OPTIONS': handler_options,
};

var server = http.createServer(function (request, response){
    console.log(request['method']+' '+request.url);
    dispatch[request['method']](request, response);
});
server.listen(PORT, function(){
    console.log("Listening to http://localhost:%s", PORT);
});

