'use client';

import React, { useEffect, useRef } from 'react';

export default function InteractiveMap({ locationName = 'Bangalore', items = [] }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // Dynamically load Leaflet CSS & JS if not already loaded
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!window.L || !mapRef.current) return;

      // Default coords for major cities
      const cityCoords = {
        'Bangalore': [12.9716, 77.5946],
        'Delhi NCR': [28.6139, 77.2090],
        'Mumbai': [19.0760, 72.8777],
        'Hyderabad': [17.3850, 78.4867],
        'Pune': [18.5204, 73.8567],
      };

      const coords = cityCoords[locationName] || [12.9716, 77.5946];

      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }

      const map = window.L.map(mapRef.current).setView(coords, 11);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Custom icon
      const goldIcon = window.L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background:#D4AF37;width:24px;height:24px;border-radius:50%;border:2px solid #000;box-shadow:0 0 10px #D4AF37;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;color:#000;">🏆</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Add markers for items
      items.forEach((item) => {
        const offsetLat = (Math.random() - 0.5) * 0.08;
        const offsetLng = (Math.random() - 0.5) * 0.08;
        const marker = window.L.marker([coords[0] + offsetLat, coords[1] + offsetLng], { icon: goldIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family:sans-serif;padding:4px;">
            <strong style="color:#000;display:block;">${item.title}</strong>
            <span style="font-size:11px;color:#555;">${item.organization}</span><br/>
            <span style="font-size:10px;color:#22C55E;font-weight:bold;">${item.location}</span>
          </div>
        `);
      });
    }
  }, [locationName, items]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px', borderRadius: '16px', overflow: 'hidden' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />
    </div>
  );
}
