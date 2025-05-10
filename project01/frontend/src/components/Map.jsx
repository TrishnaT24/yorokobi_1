import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

const Map = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Check if map container exists and map hasn't been initialized
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize the map
      const map = L.map(mapContainerRef.current).setView([40.7128, -74.0060], 12);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Store the map instance
      mapInstanceRef.current = map;

      // Trigger a resize event after the map is initialized
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/restaurants');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Clear existing markers if any
        if (mapInstanceRef.current) {
          mapInstanceRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              layer.remove();
            }
          });
        }

        // Add new markers
        data.forEach((restaurant) => {
          if (
            restaurant.latitude !== undefined &&
            restaurant.longitude !== undefined &&
            !isNaN(restaurant.latitude) &&
            !isNaN(restaurant.longitude)
          ) {
            const marker = L.marker([restaurant.latitude, restaurant.longitude]).addTo(
              mapInstanceRef.current
            );
            marker.bindPopup(`
  <h3>${restaurant.name}</h3>
  <p>${restaurant.fullAddress}</p>
  <a href="https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}" 
     target="_blank" 
     rel="noopener noreferrer">
    View on Google Maps
  </a>
`);
          } else {
            console.error('Invalid restaurant data:', restaurant);
          }
        });
      } catch (err) {
        console.error('Error fetching restaurant data:', err);
      }
    };

    fetchRestaurants();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="h-screen w-full bg-gray-100 border border-gray-300 rounded shadow-lg"
    ></div>
  );
};

export default Map;











