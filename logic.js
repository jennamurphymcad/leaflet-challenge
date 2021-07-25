// Store API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features);
});


// Define legend
var legend = L.control({position: 'bottomright'});


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + 
      "<p> Magnitude: " + (feature.properties.mag) + "</p>"
      + "<p> Depth: " + (feature.geometry.coordinates[2]) + "</p>");
  }

  //Define function to get Depth of Earthquake amnd set color variable
  function getValue(x) {
    return  x >=10 ? "#006700" :
            x >= 8 ? "#008000" :
            x >= 6 ? "#009a00" :
            x >= 4 ? "#00b300" :
            x >= 2 ? "#00cd00" :
                "#00e600";
    }

  // Define function to set style features
  function style(feature) {
    return {
      radius: 8, 
      fillOpacity: .75, 
      color: "#00ff00", 
      radius: feature.properties.mag * 2.5,
      fillColor: getValue(feature.geometry.coordinates[2]),
      weight: 1,}; 
    }

  // Set circle markers on each feature with styling specified above
  var earthquakes = L.geoJson(earthquakeData, {
      pointToLayer: function (feature, latlng) {
        return new L.CircleMarker(latlng, style(feature))  
      },
       onEachFeature: onEachFeature
   });
 

   // Create legend 
   legend.onAdd = function (map) {
   
       var div = L.DomUtil.create('div', 'info legend'),
           grades = [0, 2, 4, 6, 8, 10],
           labels = [];
   
       // loop through our density intervals and generate a label with a colored square for each interval
       for (var i = 0; i < grades.length; i++) {
           div.innerHTML +=
               '<i style="background-color:' + getValue(grades[i] + 1) + '"></i> ' +
               grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
       }
   
       return div;
   };
  
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Add legend to map
  legend.addTo(myMap);
}
