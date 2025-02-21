// Set your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1Ijoicml0YXl1amlhd3UiLCJhIjoiY203ZTR3eDdzMGF6NDJqcHFuM3Vxa2h4ciJ9.GpTJYVHv5yINM_bwhtIkNg';

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map', // ID of the div where the map will render
    style: 'mapbox://styles/mapbox/streets-v12', // Map style
    center: [-71.09415, 42.36027], // [longitude, latitude]
    zoom: 12, // Initial zoom level
    minZoom: 5, // Minimum allowed zoom
    maxZoom: 18 // Maximum allowed zoom
});

map.on('load', () => { 
    map.addSource('boston_route', {
        type: 'geojson',
        data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson?...'
    });
    
    map.addLayer({
        id: 'bike-lanes-boston',
        type: 'line',
        source: 'boston_route',
        paint: {
            'line-color': 'green',
            'line-width': 3,
            'line-opacity': 0.4
        }
    });

    map.addSource('cambridge_route', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson?...'
    });
    
    map.addLayer({
        id: 'bike-lanes-cambridge',
        type: 'line',
        source: 'cambridge_route',
        paint: {
            'line-color': 'green',
            'line-width': 3,
            'line-opacity': 0.4
        }
    });
    const svg = d3.select('#map').select('svg');
    let stations = [];

    // Load the nested JSON file
    const jsonurl = 'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';
    
    d3.json(jsonurl).then(jsonData => {
        
        console.log('Loaded JSON Data:', jsonData);
        
        const stations = jsonData.data.stations;
        console.log('Stations Array:', stations);  // Log to verify structure
        
        const circles = svg.selectAll('circle')
            .data(stations)
            .enter()
            .append('circle')
            .attr('r', 4.5)               // Radius of the circle
            .attr('fill', '#87898a')  // Circle fill color
            .attr('stroke', 'white')    // Circle border color
            .attr('stroke-width', 0.7)    // Circle border thickness
            .attr('opacity', 0.8);      // Circle opacity
        
            function getCoords(station) {
            const point = new mapboxgl.LngLat(+station.lon, +station.lat);  // Convert lon/lat to Mapbox LngLat
            const { x, y } = map.project(point);  // Project to pixel coordinates
            return { cx: x, cy: y };  // Return as object for use in SVG attributes
            }
        
        function updatePositions() {
            circles
                .attr('cx', d => getCoords(d).cx)  // Set the x-position using projected coordinates
                .attr('cy', d => getCoords(d).cy); // Set the y-position using projected coordinates
            }
        
        // Initial position update when map loads
        updatePositions();

        map.on('move', updatePositions);     // Update during map movement
        map.on('zoom', updatePositions);     // Update during zooming
        map.on('resize', updatePositions);   // Update on window resize
        map.on('moveend', updatePositions);  // Final adjustment after movement ends

        }).catch(error => {
      console.error('Error loading JSON:', error);  // Handle errors if JSON loading fails
    });


    
});