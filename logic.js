// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
      var color = "white"

      function getColor(feature.properties.geometry.coordinates[3]) {
        if (feature.properties.geometry.coordinates[3]] >= 15) {
          color = "#355E3B"
        } else if (earthquakeData.features.feature.geometry.coordinates[3] >= 10) {
          color = "#008000";
        } else if (earthquakeData.features.feature.geometry.coordinates[3] >= 5) {
          color = "#4CBB17"
        } else {
          color = "#90EE90"
        }
      };
      
  



  var earthquakes = L.geoJson(earthquakeData, {
      pointToLayer: function (feature, latlng) {
      return new L.CircleMarker(latlng, {radius: 8, 
                                          fillOpacity: 1, 
                                          color: 'black', 
                                          fillColor: getColor(feature.properties.geometry.coordinates[3]),
                                          weight: 1,});
      },
      onEachFeature: onEachFeature
  });
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  // var earthquakes = L.geoJSON(earthquakeData, {
  //   onEachFeature: onEachFeature
  // });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}





// function siteslabels (feature, layer){
//   layer.bindPopup("<p class='info header'>"+ 
//   "<b>" + feature.properties.SITE + "</b>" + 
//   "</br>" + feature.properties.Address1 +
//   "</br>" + feature.properties.stype +
//   "</p>");
//   };

//   <!-- LAYERS/SITES POP UP COLOUR CIRCLE MARKERS->
//   function getColor(stype) {
//     switch (stype) {
//       case 'POP':
//         return  'orange';
//       case 'Regen':
//         return 'green';
//       case 'LLU':
//         return 'blue';
//       case 'Colo':
//         return 'purple';
//       case 'DMSU':
//         return 'blue';
//       default:
//         return 'white';
//     }
//   }

//   <!-- LAYERS/SITES ADD LAYER->
//   L.geoJson(sites, {
//       pointToLayer: function (feature, latlng) {
//       return new L.CircleMarker(latlng, {radius: 8, 
//                                           fillOpacity: 1, 
//                                           color: 'black', 
//                                           fillColor: getColor(feature.properties.stype), 
//                                           weight: 1,});
//       },
//       onEachFeature: siteslabels
//   }).addTo(map);










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
}


// // Create a map object
// var myMap = L.map("map", {
//   center: [15.5994, -28.6731],
//   zoom: 3
// });

// L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/streets-v11",
//   accessToken: API_KEY
// }).addTo(myMap);

// // Country data
// var countries = [
//   {
//     name: "Brazil",
//     location: [-14.2350, -51.9253],
//     points: 237
//   },
//   {
//     name: "Germany",
//     location: [51.1657, 10.4515],
//     points: 221
//   },
//   {
//     name: "Italy",
//     location: [41.8719, 12.5675],
//     points: 156
//   },
//   {
//     name: "Argentina",
//     location: [-38.4161, -63.6167],
//     points: 144
//   },
//   {
//     name: "France",
//     location: [46.2276, 2.2137],
//     points: 115
//   },
//   {
//     name: "England",
//     location: [52.355, 1.1743],
//     points: 108
//   },
//   {
//     name: "Spain",
//     location: [40.4637, -3.7492],
//     points: 105
//   },
//   {
//     name: "Netherlands",
//     location: [52.1326, 5.2913],
//     points: 93
//   },
//   {
//     name: "Uruguay",
//     location: [-32.4228, -55.7658],
//     points: 84
//   },
//   {
//     name: "Sweden",
//     location: [60.1282, 18.6435],
//     points: 70
//   }
// ];


// // Loop through the cities array and create one marker for each city object
// for (var i = 0; i < countries.length; i++) {

//   // Conditionals for countries points
//   var color = "";
//   if (countries[i].points >= 200) {
//     color = "blue";
//   }
//   else if (countries[i].points <= 199 && countries[i].points >= 150) {
//     color = "green";
//   }
//   else if (countries[i].points <= 149 && countries[i].points >= 100) {
//     color = "yellow";
//   }
//   else {
//     color = "red";
//   }


//   // Add circles to map
//   L.circleMarker(countries[i].location, {
//     fillOpacity: 0.75,
//     color: "white",
//     fillColor: color,
//     // Adjust radius
//     radius: countries[i].points / 7.5
//   }).bindPopup("<h1>" + countries[i].name + "</h1> <hr> <h3>Points: " + countries[i].points + "</h3>").addTo(myMap);
// }
