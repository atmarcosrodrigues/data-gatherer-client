// Gatherer Client App
var app = angular.module('gathererClient', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

app.factory('entry', function(){
	return {    
		title: "",
		author: "",
		org: "",
		uploader: "",
		periodStart: new Date(),
		periodEnd: new Date(),
		searchAuthor: "",
		searchTitle: "",
		searchUploader: "",
		searchOrg: "",

	}

});


// Define Angular JS provider syboml
app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});

