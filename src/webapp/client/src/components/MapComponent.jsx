import React, { useState } from "react";
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
  const [feedback, setFeedback] = useState({});

  // Filtra per le feature di tipo area (geometria Polygon e, eventualmente, categoria "area")
  const areas = data.filter(
    (poi) =>
      poi.geometry.type === "Polygon" &&
      poi.properties.category === "area"
  );

  const handleFeedback = (areaIndex, type) => {
    setFeedback(prev => ({
      ...prev,
      [areaIndex]: type
    }));

    alert(`Feedback for area ${areaIndex}: ${type}`);
  };

  return (
    <MapContainer
      className="map-container-map"
      center={[46.0667, 11.1211]}
      zoom={14}
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
                alt=""
                style={{ width: "100px", margin: "5px" }}
              />
            ))}
            <div className="feedback-buttons-container">
              <button
                onClick={() => handleFeedback(index, 'like')}
                className={`feedback-button like ${feedback[index] === 'like' ? 'active' : ''}`}
              >
                Like
              </button>
              <button
                onClick={() => handleFeedback(index, 'dislike')}
                className={`feedback-button dislike ${feedback[index] === 'dislike' ? 'active' : ''}`}
              >
                Dislike
              </button>
            </div>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
