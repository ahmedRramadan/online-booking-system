import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import "../node_modules/leaflet/dist/leaflet.css";

function DraggableMarker({ onLocationChange }) {
  const map = useMapEvents({
    click() {
      // إزالة جميع العلامات السابقة
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // إضافة علامة جديدة قابلة للسحب
      const marker = L.marker(map.getCenter(), {
        draggable: true,
      }).addTo(map);

      marker.on('dragend', function () {
        const position = marker.getLatLng();
        onLocationChange({ lat: position.lat, lng: position.lng });
      });

      // تحديث الموقع الأولي
      onLocationChange({ lat: map.getCenter().lat, lng: map.getCenter().lng });
    }
  });

  return null; // لا يرجع JSX
}

const MapComponent = ({ onLocationChange }) => {
  return (
    <MapContainer center={[26.8206, 30.8025]} zoom={5} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <DraggableMarker onLocationChange={onLocationChange} />
    </MapContainer>
  );
};

export default MapComponent;
