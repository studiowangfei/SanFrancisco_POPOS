//google map api setting
var map;
function initialize(){
  // Create an array of styles.
  var styles = [{"featureType": "water", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#0008FF" }, { "saturation": -54 }, { "lightness": -42 }]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":21}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"weight":0.1},{"lightness":-100}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":-15}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"color":"#808080"},{"hue":"#000000"},{"lightness":50}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#3ba635"},{"saturation":-70},{"lightness":50}]}]
  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles,
    {name: "San Francisco POPOS Viz"});

  // Create a map object, and include the MapTypeId to add
  // to the map type control.

  var mapOptions = {
    zoom: 17,
    center: new google.maps.LatLng(37.791117, -122.399004),
    disableDefaultUI: false,
    streetViewControl: false,
    zoomControl: true,
    panControl: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  };
  var map = new google.maps.Map(document.getElementById('sfpopos_map-canvas'),
    mapOptions);

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  var popos_marker =[];
  for(var i=0; i<popos.length; i++){
    var myLatLng = new google.maps.LatLng(popos[i].latitude, popos[i].longitude);
    // different color based on quality rating
    var rating_color;
    if (popos[i].quality === 'poor'){
      rating_color = '#b5dea2'
    }else if(popos[i].quality === 'fair'){
      rating_color = '#6CBE45'
    }else if(popos[i].quality === 'good'){
      rating_color = '#4b8530'
    }else {
      rating_color = '#2b4c1b'
    }

    popos_marker[i] = new google.maps.Marker({
      position: myLatLng,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: rating_color,
        fillOpacity: 0.85,
        scale: 15,
        strokeColor: 'black',
        strokeWeight: 0
      },
      draggable: false,
      map: map
    });
  }

  var infowindow;
  var prev_infowindow = false;
  function infoWindowOpen(i){
    return function(){
      var string = '<div class="sfpopos_map_infowindow" id="sfpopos_map_infowindow_'+i+'">'+
      '<div id="popos_address">'+popos[i].address+'</div>'+
      '<div class="popos_year">Year: '+popos[i].year+'</div>'+
      '<div class="popos_quality">Spatial Quality: '+popos[i].quality+'</div>'+
      '<div class="popos_description">'+popos[i].description+'</div>'+
      '<div class="popos_photo"><img src="../img/project/sfpopos/site_photos/'+i+'.jpg"/></div>'+
      '</div>';

      infowindow = new google.maps.InfoWindow({
        content: string,
        disableAutoPan: false
      });

      //track and close last-opened infowindow
      if(prev_infowindow){
        prev_infowindow.close();
      }
      prev_infowindow = infowindow;
      infowindow.open(map, popos_marker[i]);

      // different color background based on quality of items
      /*var current_infowindowDiv = document.getElementById('sfpopos_map_infowindow_'+i);
      if (popos[i].quality === 'poor'){
        current_infowindowDiv.style.backgroundColor = '#b5dea2'
      }else if(popos[i].quality === 'fair'){
        current_infowindowDiv.style.backgroundColor = '#6CBE45'
      }else if(popos[i].quality === 'good'){
        current_infowindowDiv.style.backgroundColor = '#4b8530'
      }else {
        current_infowindowDiv.style.backgroundColor = '#2b4c1b'
      }*/
    }
  }

  for(var i=0; i<popos.length; i++){
    popos_marker[i].addListener('click', infoWindowOpen(i));
  }

  //transit layer automatic overlay
  //var transitLayer = new google.maps.TransitLayer();
  //transitLayer.setMap(map);
  //var trafficLayer = new google.maps.TrafficLayer();
  //trafficLayer.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);
