#!/usr/bin/env node

var http = require('http');
var url = require('url');
var path = require("path");
var fs = require('fs');

const PORT = 9998;

var messageCount = 0;
var maxMessages = 10;
var messages =[];
var resources = { messages: { "data": messages, "postHandler" : postMessage } };


function handlerGet (request, response, resource) {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(resources[resource].data));
};

function handlerPost (request, response, resource) {
    var handler = resources[resource].postHandler;

    if (!handler)
        return;

    // http://stackoverflow.com/a/4310087/5552144 'Should' check for message length to avoid hanging on infinite length files...
    request.on('data', function(data) {
        handler(data);
    });

	response.writeHead(200);
    response.end();
};

function postMessage (data) {
    if (messageCount >= maxMessages)
    {
        messages.shift();
    }
    messages.push( String(data));	//Must be cast to String - else read as ascii
    messageCount++;
}

function error(response)
{
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.end("404 Not Found\n");
}

var server = http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    console.log(request.method + ' ' + uri);

    // GET/POST resources by key.
    if (uri.startsWith("/resources/"))
    {
        var resource = uri.split("/")[2];
        if (resource && resources[resource]) // Check that requested resource has a value and exists in resources.
        {
            if (request.method === "GET")
            {
                handlerGet(request, response, resource);
            }
            else
            {
                handlerPost(request, response, resource);
            }
        }
        else
        {
            error(response);
        }
        return;
    }

    // GET: serve static files.
    // http://stackoverflow.com/a/13635318/5552144
    var filename = path.join(process.cwd(), uri);

    fs.exists(filename, function(exists) {
        if(!exists) {
            error(response)
            return;
        }

        if (fs.statSync(filename).isDirectory())
            filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.end(err + "\n");
                return;
            }

            response.writeHead(200);
            response.end(file, "binary");
        });
    });
}).listen(PORT, function(){
    console.log("Listening to http://localhost:%s", PORT);
});

