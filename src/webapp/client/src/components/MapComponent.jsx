import React from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../css/map.css";

// Configurazione delle icone (rimane invariata sebbene in questo caso non usiamo Marker)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapComponent = ({ data }) => {
  // Filtra per le feature di tipo area (geometria Polygon e, eventualmente, categoria "area")
  const areas = data.filter(
    (poi) =>
      poi.geometry.type === "Polygon" &&
      poi.properties.category === "area"
  );

  return (
    <MapContainer
      className="map-container-map"
      center={[46.0667, 11.1211]}
      zoom={14}
      //style={{ width: "100%", height: "100vh" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {areas.map((area, index) => (
        <Polygon
          key={index}
          positions={area.geometry.coordinates}
          pathOptions={{ color: "purple" }}
        >
          <Popup>
            <strong>{area.properties.name}</strong>
            <br />
            {area.properties.description}
            <br />
            {area.properties.images.map((image, i) => (
              <img
                key={i}
                src={image}
                alt={`Image ${i}`}
                style={{ width: "100px", margin: "5px" }}
              />
            ))}
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
