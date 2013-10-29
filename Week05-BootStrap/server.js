var http = require('http');
var url = require('url');
var port = process.env.PORT || 30025;
var fs = require('fs');

function getPath(request) {
	return url.parse(request.url).pathname;
}

// Thanks to Wallace: http://stackoverflow.com/a/1203361/253576
function getExtension(fileName) {
	var fileNameArray = fileName.split(".");
	if( fileNameArray.length === 1 || ( fileNameArray[0] === "" && fileNameArray.length === 2 ) ) {
		return "";
	}
	return fileNameArray.pop().toLowerCase();    
}

function loadContent(request, response) {
	var path = getPath(request);
	console.log("Request for " + path + " received.");
	if (getExtension(path) === 'css') {
		var css = fs.readFileSync(__dirname + path);
		response.writeHead(200, {'Content-Type': 'text/css'});
		response.write(css);
		response.end();
	} else if (getExtension(path) === 'html') {
		var html = fs.readFileSync(__dirname + path);
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(html);
		response.end();
	} else if (getExtension(path) === 'png') {
		fs.readFile(__dirname + path, "binary", function(err, file) {
			console.log("PNG detected");
			if(err) {
				console.log("Error reading binary file");
				response.writeHeader(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
			}
			else{
				console.log("PNG loaded");
				response.writeHeader(200, {"Content-Type": "image/png"});
				response.write(file, "binary");
				response.end();
			}
		});
	} else {
	    var html = fs.readFileSync(__dirname + '/index.html');
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(html);
		response.end();
	}
}

http.createServer(loadContent).listen(port);
console.log("Server has started:" + port);