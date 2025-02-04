import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AddPoiForm from "./AddPoiForm";
import "../css/PoiManagement.css";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const PoiManagementComponent = ({ pois, onAddPoi }) => {
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleAddButtonClick = () => {
    setIsAddingMode(true);
    setShowForm(false);
    setSelectedCoords(null);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (isAddingMode) {
          setSelectedCoords([e.latlng.lat, e.latlng.lng]);
          setShowForm(true);
          setIsAddingMode(false);
        }
      },
    });
    return null;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !selectedCoords) return;

    const newPoi = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [selectedCoords[1], selectedCoords[0]],
      },
      properties: {
        ...formData,
        images: [],
        osmTags: {},
        category: "place",
      },
    };

    onAddPoi(newPoi);
    setShowForm(false);
    setFormData({ name: "", description: "" });
    setSelectedCoords(null);
  };

  return (
    <div className="poi-management-container">
      <MapContainer
        center={[46.0667, 11.1211]}
        zoom={14}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Existing POIs */}
        {pois.filter(p => p.geometry.type === "Point").map((poi, i) => (
          <Marker
            key={i}
            position={[poi.geometry.coordinates[1], poi.geometry.coordinates[0]]}
          >
            <Popup>
              <h3>{poi.properties.name}</h3>
              <p>{poi.properties.description}</p>
            </Popup>
          </Marker>
        ))}

        {/* Selected position marker */}
        {selectedCoords && (
          <Marker position={selectedCoords} />
        )}

        <MapClickHandler />
      </MapContainer>

      <button 
        className={`add-poi-button ${isAddingMode ? "active" : ""}`}
        onClick={handleAddButtonClick}
      >
        {isAddingMode ? "Click map to select location" : "Add New POI"}
      </button>

      {showForm && (
        <AddPoiForm
          coordinates={selectedCoords}
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedCoords(null);
          }}
        />
      )}
    </div>
  );
};

export default PoiManagementComponent;