'use strict'

var getCSV  = function (url, callback) {
    var callback = (typeof callback == 'function' ? callback : false), xhr = null;
    try {
      xhr = new XMLHttpRequest();
    } catch (e) {
      try {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
    }
    if (!xhr)
           return null;
    xhr.open("GET", url,true);
    xhr.onreadystatechange=function() {
      if (xhr.readyState==4 && callback) {
        callback(xhr.responseText)
      }
    }
    xhr.send(null);
    return xhr;
}

//var csv is the CSV file with headers
var csvJSON = function(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

	  var obj = {};
	  var currentline=lines[i].split(",");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = parseInt(currentline[j]);
	  }

	  result.push(obj);

  }
  
  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}

var pointCloudParent;
var pointCloudElement;

function removePointCloudFromDOM(){
	pointCloudParent.removeChild(pointCloudElement);
}

function appendPointCloudToDOM(data, colorPreset){

	var c = colorPreset;
	if(!c){
		c = "Cool";
	}

	console.log(c);

	pointCloudElement = document.createElement("a-scatterplot");
	pointCloudElement.setAttribute('x', "Y");
	pointCloudElement.setAttribute('y', "Z");
	pointCloudElement.setAttribute('z', "X");
	pointCloudElement.setAttribute('val', "SIGNAL_STRENGTH");
	//TODO colorpreset support
	pointCloudElement.setAttribute('colorpreset', "cool");
	pointCloudElement.setAttribute('showcolorbar', "false");
	
	pointCloudElement.setAttribute('scale', data.scaleX + ' ' + data.scaleY + ' ' + data.scaleZ);
	pointCloudElement.setAttribute('position', data.positionX + ' ' + data.positionY + ' ' + data.positionZ);
	
	// json url 
	if(data.jsonUrl){
		pointCloudElement.setAttribute('src', 'url(' + data.jsonUrl + ')');
	}

	// csv raw
	if(data.rawJson){
		pointCloudElement.setAttribute('raw', data.rawJson);
	}

	pointCloudParent = document.getElementById('scene');
	pointCloudParent.appendChild(pointCloudElement); 
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


var pointCloudId = window.location.hash.substr(1);

const SPACE_ID = 'wb11bvhb5t8w'
const ACCESS_TOKEN = 'c48061cd3f8704a71f3301c7c343a34cd00d152ddcc6969692bf6c1da13cc5ff'

//const contentful = require('contentful')
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: SPACE_ID,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: ACCESS_TOKEN
})

var loadPointCloud = function(){

	if(pointCloudId){
	// This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
	client.getEntry(pointCloudId).then(
		function(pointCloudEntry){

			console.log(pointCloudEntry);

			var pointCloudData = {
							scaleX: pointCloudEntry.fields.scaleX,
							scaleY: pointCloudEntry.fields.scaleY,
							scaleZ: pointCloudEntry.fields.scaleZ,
							positionX: pointCloudEntry.fields.positionX,
							positionY: pointCloudEntry.fields.positionY,
							positionZ: pointCloudEntry.fields.positionZ,
						};

			var jsonFile = pointCloudEntry.fields.jsonFile;
			var csvFile = pointCloudEntry.fields.csvFile;

			// if(jsonFile){
			// 	client.getAsset(jsonFile.sys.id)
			// 		.then(function(jsonFileAsset){ 
			// 			console.log(jsonFileAsset);
			// 			pointCloudData.jsonUrl = jsonFileAsset.fields.file.url;
			// 			appendPointCloudToDOM(pointCloudData);
			// 		})
			// 		.catch(console.error)
			// }

			if(csvFile){
				client.getAsset(csvFile.sys.id)
					.then(function(csvFileAsset){ console.log(csvFileAsset);

						getCSV(csvFileAsset.fields.file.url, function(csvString){ 
							
							pointCloudData.rawJson = csvJSON(csvString);
							appendPointCloudToDOM(pointCloudData);
						});

						
					})
					.catch(console.error)
			}

		}).catch(console.error)
	}
	else{
		// random point clouds periodically -- later interaction maybe

		//var csv is the CSV file with headers
		var randomJSON = function(){

		  var pointCount = 1000000;//300000;

		  var result = [];

		  var headers=["X","Y","Z","SIGNAL_STRENGTH"];
		  var headersMax=[10,100,100,99]; //TODO same negative range

		  for(var i=1;i<pointCount;i++){

			  var obj = {};

			  for(var j=0;j<headers.length;j++){
				  obj[headers[j]] = parseInt(getRandomInt(headersMax[j]));
			  }

			  result.push(obj);

		  }
		  
		  //return result; //JavaScript object
		  return JSON.stringify(result); //JSON
		}

		var colorPresets=[
			"Cool",
			"Jet",
			"Hot",
			"Terrain",
			"Grey"
			];
		var randomColorPreset = colorPresets[getRandomInt(colorPresets.length)];

		var randomPointCloudData = {
							scaleX: 82,
							scaleY: 42,
							scaleZ: 105,
							positionX: -16,
							positionY: -16,
							positionZ: -40,
						};

		randomPointCloudData.rawJson = randomJSON();
		appendPointCloudToDOM(randomPointCloudData, randomColorPreset);
	}
};

document.addEventListener("DOMContentLoaded", function(event) {
	document.querySelector('a-scene').addEventListener('loaded', function () {
		loadPointCloud();
		setInterval(function() {
			removePointCloudFromDOM();
		    loadPointCloud();
		}, 300 * 1000);
	    
	});
  });
