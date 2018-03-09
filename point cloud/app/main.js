'use strict'


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

if(pointCloudId){
// This API call will request an entry with the specified ID from the space defined at the top, using a space-specific access token.
client.getEntry(pointCloudId).then(
	function(pointCloudEntry){

		console.log(pointCloudEntry);

		var jsonFile = pointCloudEntry.fields.jsonFile;

		if(jsonFile){
			var jsonFileId = jsonFile.sys.id;

			client.getAsset(jsonFileId)
				.then(function(jsonFileAsset){
					console.log(jsonFileAsset);

					var jsonFileUrl = jsonFileAsset.fields.file.url;

					var pointCloudParent = document.getElementById('scene');
					
					var scaleAtrribute = 'scale="' + pointCloudEntry.fields.scaleX + ' ' + pointCloudEntry.fields.scaleY + ' ' + pointCloudEntry.fields.scaleZ + '"';
					var positionAttribute = 'position="' + pointCloudEntry.fields.positionX + ' ' + pointCloudEntry.fields.positionY + ' ' + pointCloudEntry.fields.positionZ + '"';
					var pointCloudTemplate = '<a-scatterplot src="url(' + jsonFileUrl +')" x="Y" y="Z" z="X" val="SIGNAL_STRENGTH" colorpreset="cool" ' + scaleAtrribute + ' ' + positionAttribute + ' > </a-scatterplot>';
					
					pointCloudParent.insertAdjacentHTML( 'beforeend', pointCloudTemplate );
				})
				.catch(console.error)
		}
	}).catch(console.error)
}
