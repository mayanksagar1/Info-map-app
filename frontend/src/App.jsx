import React, {useEffect, useState} from "react";
import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AddMarker = ({setMarkers}) => {
  useMapEvents({
    click: async (e) => {
      const {lat, lng} = e.latlng;
      const info = prompt("Enter marker information:");
      if (info) {
        const response = await fetch(`${API_BASE_URL}/markers`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({lat, lng, info}),
        });
        const newMarker = await response.json();
        setMarkers((prev) => [...prev, newMarker]);
      }
    },
  });

  return null;
};

const App = () => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/markers`)
      .then((res) => res.json())
      .then((data) => setMarkers(data));
  }, []);

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{height: "100vh", width: "100%"}}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <AddMarker setMarkers={setMarkers} />
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]}>
          <Popup>{marker.info}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default App;
