# SB5-TEC-E16_Assignment1
Assignment 01 for distribution and integration technologies

This is an anonymous chat service, inspired by the 4chan message boards. It allows users to send messages to a global message board. 
To put a spin on this and create a deeper sense of immediancy, we have chosen that only 10 messages will be in the message board at one time.
Old messages are therefore lost forever, as new ones are posted.

Technologies used: 
HTML client file, using JavaScript for net functionality.

JavaScript server running on Node.js.


How to run the software:
To run the server, Node.js must be installed, as that is the used runtime environment. The file can then be run from its directory with the command: 

node server.js 

the console should reply with "Listening to http://localhost:9998"

To open a client, a browser that support JavaScript is needed. All major browsers currently do, for this project Chrome was used to run the client.
Simply right click the client file, and open it with Chrome. (Or another browser with a JS Engine)


Architecture:
We have a very simple client-server architecture. The server 