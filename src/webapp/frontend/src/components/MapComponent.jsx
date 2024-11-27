import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapComponent = () => {
  return (
    <MapContainer
      center={[46.0667, 11.1211]} 
      zoom={14} 
      style={{ width: "100%", height: "80vh" }}
    >
      {/* Tile standard di OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Esempio di Marker su un punto di interesse */}
      <Marker position={[46.0704, 11.1195]}> {/* Piazza Duomo */}
        <Popup>
          Piazza Duomo<br /> Un punto di interesse storico a Trento.
        </Popup>
      </Marker>

      <Marker position={[46.0675, 11.1216]}> {/* Muse */}
        <Popup>
          Muse - Museo delle Scienze<br /> Un altro punto di interesse.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;