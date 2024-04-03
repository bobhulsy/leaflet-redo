// Tile layer from OpenStreetMap
let baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// URL for earthquake data
let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine marker color based on depth
function getColor(depth) {
  if (depth < 10) return '#00FF00';
  else if (depth < 30) return '#ADFF2F';
  else if (depth < 50) return '#FFFF00';
  else if (depth < 70) return '#FFD700';
  else if (depth < 90) return '#FFA500';
  else return '#FF0000';
}

// Create the map
let myMap = L.map('map').setView([37.09, -95.71], 4).addLayer(baseMap);

// Function to handle GeoJSON data and create markers
function createMarkers(data) {
    // Create a GeoJSON layer
    let earthquakes = L.geoJSON(data, {
        // Create a circle marker for each earthquake
        pointToLayer: function(feature, location) {
            return L.circleMarker(location, {
                radius: feature.properties.mag * 4, // Scale radius by magnitude
                fillColor: getColor(feature.geometry.coordinates[2]),  // Set color based on depth
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<h3>${feature.properties.place}</h3><hr>
                        <p>Magnitude: ${feature.properties.mag}</p>
                        <p>Depth: ${feature.geometry.coordinates[2]}</p>`);
        }
    });

    // Add the earthquake layer to the map
    earthquakes.addTo(myMap);

    // Create the legend
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'info legend');
        let depths = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML += '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
}

// Fetch GeoJSON data with D3
d3.json(earthquakeData).then(createMarkers); 