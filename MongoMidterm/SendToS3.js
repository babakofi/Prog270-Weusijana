// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/Client.html
// http://aws.amazon.com/pricing/s3/

/* jshint browser: true, devel: true, node: true, unused: true */

var AWS = require('aws-sdk');
var config = AWS.config.loadFromPath('../config.json');
var s3 = new AWS.S3();
var fs = require('fs');
var walk = require('walk');

var bucketName = 'prog270s3';

function listBuckets(s3) {
	console.log("calling listBuckets");
	s3.client.listBuckets(function(err, data) {
		if (err) {
			console.log(err);
		} else {
			for (var index in data.Buckets) {
				var bucket = data.Buckets[index];
				console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
			}
		}
	});
}

function writeFile(localFileName, nameOnS3, binary) {
	// Read in the file, convert it to base64, store to S3
	
	nameOnS3 = "Week07-MongoMidterm" + nameOnS3;
	
	fs.readFile(localFileName, function(err, data) {
		if (err) {
			throw err;
		}

		if (binary) {
			console.log("Making binary");
			data = new Buffer(data, 'binary').toString('base64');
		}
		
		var ext = localFileName.split('.').pop();
		
		var contentType = 'text/html';
		switch(ext) {
			case 'db':
				return;
				
			case 'htm':
			case 'html': 
				break;
			case 'js':
				contentType = 'application/x-javascript';
				break;
			case 'css':
				contentType = 'text/css';
				break;
			case 'png':
				contentType = 'image/png';
				break;
			case 'jpg':
				contentType = 'image/jpg';
				break;
			case 'bmp':
				contentType = 'image/bmp';
				break;
			case 'gif':
				contentType = 'image/gif';
				break;
		}

		s3.client.putObject({
			ACL: 'public-read',
			Bucket : bucketName,
			Key : nameOnS3,
			Body : data,
			ContentType: contentType
		}, function(err, response) {
			if (err) {
				console.log("Error: " + err);
			} else {
				console.log('Successfully uploaded package: ' + nameOnS3 + ' Content Type: ' + contentType + ' ' + response);
			}
		});
	});
}

function walkDirs(folderName) {
	var options = {
		followLinks : false
	};

	var walker = walk.walk(folderName, options);


	walker.on("names", function(root, nodeNamesArray) {
		nodeNamesArray.sort(function(a, b) {
			if (a > b)
				return 1;
			if (a < b)
				return -1;
			return 0;
		});
	});

	walker.on("directories", function(root, dirStatsArray, next) {
		// dirStatsArray is an array of `stat` objects with the additional attributes
		// * type
		// * error
		// * name
		if (typeof dirStatsArray != 'undefined') 
			console.log("Directories: " + dirStatsArray.type);
		next();
	});

	walker.on("file", function(root, fileStats, next) {
		// console.log("fileStats.name: " + fileStats.name);
		var fileName = root + "/" + fileStats.name;
		var pieces = root.split('/');
		var s3Dir = "";
		for (var i = 0; i < pieces.length; i++) {
			s3Dir += "/" + pieces[i];
		}		
		var s3Name = s3Dir + '/' + fileStats.name;
		console.log(s3Name);
		// console.log("s3Name: " + s3Name);
		
		writeFile(fileName, s3Name, false);
		next();
	});

	walker.on("errors", function(root, nodeStatsArray, next) {
		console.log(root);
		next();
	});

	walker.on("end", function() {
		console.log("all done");
	});

}

// walkDirs('Images');
// walkDirs('Source');
// walkDirs('Style');
writeFile('170px-Ijmbl_cover.jpg', '/170px-Ijmbl_cover.jpg', false);
writeFile('320px-Alan_Kay_and_the_prototype_of_Dynabook.jpg', '/320px-Alan_Kay_and_the_prototype_of_Dynabook.jpg', false);
writeFile('About.html', '/About.html', false);
writeFile('angular-mocks.js', '/angular-mocks.js', false);
writeFile('angular-resource.js', '/angular-resource.js', false);
writeFile('angular.js', '/angular.js', false);
writeFile('baba-kofi-weusijana.png', '/baba-kofi-weusijana.png', false);
writeFile('Contacts.html', '/Contacts.html', false);
writeFile('favicon.png', '/favicon.png', false);
writeFile('iamlearn.png', '/iamlearn.png', false);
writeFile('index.css', '/index.css', false);
writeFile('index.html', '/index.html', false);
writeFile('index.js', '/index.js', false);
writeFile('Linguaphone.png', '/Linguaphone.png', false);
writeFile('mobilelearninghistory.html', '/mobilelearninghistory.html', false);
writeFile('MongoData.js', '/MongoData.js', false);
writeFile('Server.js', '/Server.js', false);
writeFile('Shapes01.png', '/Shapes01.png', false);
writeFile('Shapes02.png', '/Shapes02.png', false);
//listBuckets(s3);

