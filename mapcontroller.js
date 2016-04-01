var mapApp = angular.module("mapApp", []);
mapApp.controller("mapController", function($scope, $http){
	var checkedPlaces = [];
	$scope.places = places;
	$scope.markers = [];

	$scope.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: new google.maps.LatLng(40.0000, -98.0000)
	 });
	var infowindow = new google.maps.InfoWindow;

  	function createMarker(city){
	  	var latLon = city.latLon.split(",");
	  	var lat = latLon[0];
	  	var lon = latLon[1];
		var marker = new google.maps.Marker({
			lat: Number(lat),
			lon: Number(lon),
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
			'<p><b>Rank: </b>#'+city.yearRank+'</p>'+
			'<p><b>Population: </b>'+city.lastCensus+'</p>'+
			'<p><b>Population Density: </b>'+city.lastPopDensity+'</p>'+
			'<p><b>Land Area: </b>'+city.landArea+'</p>'+
			'<p><a href="#" onclick="dirClick('+lat+','+lon+')" class="get-directions">Get Directions</a></p>'+
			'</div>'+
			'</div>';

	  	marker.addListener('click', function() {
	  		infowindow.setContent(contentString);
	    	infowindow.open($scope.map, marker);
	  	});
	  $scope.markers.push(marker);
	}

	$scope.cityClick = function(i){
		google.maps.event.trigger($scope.markers[i], "click");
	}

	$scope.zoomClick = function(i){
		var latLon = cities[i].latLon.split(',');
	    var lat = latLon[0];
	    var lon = latLon[1];
		$scope.map.setZoom(12);
		$scope.map.panTo({lat: $scope.markers[i].lat, lng: $scope.markers[i].lon});
		$("#options").removeClass("hidden");
		$("#options").addClass("view-height");
		$("#map-panel").addClass("hidden");
		
		var center = new google.maps.LatLng(lat, lon);
        $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 10
        });
        for(i=0; i<cities.length; i++){
        createMarker(cities[i]);
        } 
        
    } 
        
    $scope.makePlaces = function(){
        var center = $scope.map.getCenter();
        $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 10
        });
        for(i=0; i<cities.length; i++){
        createMarker(cities[i]);
        } 


        var service = new google.maps.places.PlacesService($scope.map);
        service.nearbySearch({
          location: center,
          radius: 5000,
          type: checkedPlaces
        }, callback);
          
      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker2(results[i]);
            
          }
        }
      }
     function createMarker2(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          position: placeLoc,
          map: $scope.map,
          title: place.city,
          animation: google.maps.Animation.DROP
        });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open($scope.map, this);
        });
      }

	}
		dirClick = function(lat, lon){
		$("#map-panel").addClass("hidden");
		$("#driving-directions").addClass("view-height");

		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var map = new google.maps.Map(document.getElementById('map'),{
	        zoom: 7,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
      	});
	  directionsDisplay.setMap(map);
	  directionsDisplay.setPanel(document.getElementById('driving-directions'))
		
		  var request = {
		    origin: "Atlanta, GA",
		    destination: new google.maps.LatLng(lat,lon),
		    travelMode: google.maps.TravelMode.DRIVING
		  };
		  directionsService.route(request, function(result, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		      directionsDisplay.setDirections(result);
		    }
		  });
	}

	$scope.cities = cities;
	for(var i = 0; i < cities.length; i++){
		createMarker(cities[i]);
	}

	$scope.placeChecked = function(placeSent){
		// checkedPlaces += placeSent + " ";
		checkedPlaces.push(placeSent);
		console.log(checkedPlaces);
		$scope.makePlaces();
	}

});

