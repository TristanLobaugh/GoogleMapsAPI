
var mapApp = angular.module("mapApp", []);

mapApp.controller("mapController", function($scope, $http){
	
	$scope.markers = [];

	$scope.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: new google.maps.LatLng(40.0000, -98.0000)
	 });


  	function createMarker(city){
	  	console.log(city);
	  	var latLon = city.latLon.split(",");
	  	var lat = latLon[0];
	  	var lon = latLon[1];
		var marker = new google.maps.Marker({
		    position: new google.maps.LatLng(lat, lon),
		    map: $scope.map,
		    title: city.city,
		    animation: google.maps.Animation.DROP
		});

	    var contentString = '<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<h1 id="firstHeading" class="firstHeading">'+city.city+'</h1>'+
			'<div id="bodyContent">'+
			'<p><b>'+city.city+'</b>, <b>'+city.state+'</b></p>'+
			'<p><b>Rank: #</b>'+city.yearRank+'</p>'+
			'<p><b>Population: </b>'+city.lastCensus+'</p>'+
			'<p><b>Population Density: </b>'+city.lastPopDensity+'</p>'+
			'<p><b>Land Area: </b>'+city.landArea+'</p>'+
			'</div>'+
			'</div>';

	  	var infowindow = new google.maps.InfoWindow({
	    	content: contentString
	  	});

	  	marker.addListener('click', function() {

	    infowindow.open($scope.map, marker);
	  });
	}
	$scope.cities = cities;
	for(var i = 0; i < cities.length; i++){
		createMarker(cities[i]);
	}
});

