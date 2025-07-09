document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map
    const map = L.map('map').setView([0, 0], 2); // Centered at [0,0] with zoom level 2

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Function to fetch earthquake data
    const fetchEarthquakeData = async () => {
        const usgsApiUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
        const disasterInfoDiv = document.getElementById('disaster-info');

        try {
            const response = await fetch(usgsApiUrl);
            const data = await response.json();

            disasterInfoDiv.innerHTML = '<h3>Recent Earthquakes (Last 24 Hours)</h3>';
            
            if (data.features.length > 0) {
                data.features.forEach(feature => {
                    const coords = feature.geometry.coordinates;
                    const properties = feature.properties;

                    // Add markers to the map
                    L.marker([coords[1], coords[0]])
                        .addTo(map)
                        .bindPopup(`<b>Magnitude:</b> ${properties.mag}<br><b>Location:</b> ${properties.place}<br><b>Time:</b> ${new Date(properties.time).toLocaleString()}`);

                    // Display info in the sidebar
                    const p = document.createElement('p');
                    p.innerHTML = `<b>Magnitude:</b> ${properties.mag} | <b>Location:</b> ${properties.place} | <b>Time:</b> ${new Date(properties.time).toLocaleString()}`;
                    disasterInfoDiv.appendChild(p);
                });
            } else {
                disasterInfoDiv.innerHTML += '<p>No significant earthquakes reported in the last 24 hours.</p>';
            }

        } catch (error) {
            console.error('Error fetching earthquake data:', error);
            disasterInfoDiv.innerHTML = '<p>Failed to load earthquake data. Please try again later.</p>';
        }
    };

    // Fetch data when the page loads
    fetchEarthquakeData();

    // Optionally, refresh data every few minutes
    // setInterval(fetchEarthquakeData, 5 * 60 * 1000); // Every 5 minutes
});
