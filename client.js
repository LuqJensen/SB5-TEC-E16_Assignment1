url = "http://localhost:9998/resources/r1";

var timer;
var updateInterval = 5;
var timeToUpdate = updateInterval;

get = function(url, callback) {
	var xmlHttp = new XMLHttpRequest(); // The XMLHttpRequest object can be used to request data from a web server. See: http://www.w3schools.com/xml/dom_httprequest.asp
    xmlHttp.onreadystatechange = function() { // Sets the onreadystatechange event.
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) // state 4, status 200 = response ready.
            callback(JSON.parse(xmlHttp.responseText)); // Since response is ready, we give it back in the callback function.
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
};

post = function(url, input, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", url, true); // true for asynchronous 
    xmlHttp.send(input);
};

do_get = function () {
    get(url, function (content) {
        var textarea = document.getElementById('data');
        textarea.value = content.toString().replace(/,/g, "\n");
    });
};
do_post = function () {
    var textarea = document.getElementById('input');
    post(url, textarea.value, function (content) {
        textarea.value = "";
        do_get();
    });
};

function autoUpdate(checkbox)
{
    if (checkbox.checked)
    {
        timer = setInterval(function() 
        {
            timeToUpdate -= 1;
            
            if (timeToUpdate <= 0) 
            {
                timeToUpdate = updateInterval;
                do_get();
            }
            
            var label = document.getElementById('timeLeft');
            label.innerHTML = timeToUpdate; 
        }, 1000);
    }
    else if (timer)
    {
        clearInterval(timer);
        var label = document.getElementById('timeLeft');
        label.innerHTML = ""; 
    }
}