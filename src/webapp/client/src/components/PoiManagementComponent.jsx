import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { FeatureGroup } from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AddPoiForm from "./AddPoiForm";
import "../css/poiManagement.css";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const PoiManagementComponent = ({ pois, onAddPoi, onAddPolygon }) => {
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isAddingPolygon, setIsAddingPolygon] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleAddPointClick = () => {
    setIsAddingPoint(true);
    setIsAddingPolygon(false);
    setShowForm(false);
    setSelectedCoords(null);
  };

  const handleAddPolygonClick = () => {
    setIsAddingPolygon(true);
    setIsAddingPoint(false);
    setShowForm(false);
    setSelectedCoords(null);
  };

  const handleCreatedPolygon = (e) => {
    const layer = e.layer;
    const polygon = layer.toGeoJSON();
    onAddPolygon(polygon);
    setIsAddingPolygon(false);
    setShowForm(true);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (isAddingPoint) {
          setSelectedCoords([e.latlng.lat, e.latlng.lng]);
          setShowForm(true);
          setIsAddingPoint(false);
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
        type: "Point",//FIXME
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

        {/* Existing points POIs */}
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
        
        {isAddingPolygon && (
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleCreatedPolygon}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                polygon: true,
              }}
            />
          </FeatureGroup>
        )}

        <MapClickHandler />
      </MapContainer>

      <div className="map-controls">
        <button
          className={`add-point-button ${isAddingPoint ? "active" : ""}`}
          onClick={handleAddPointClick}
        >
          {isAddingPoint ? "Click map to select location" : "Add Point"}
        </button>
        <button
          className={`add-polygon-button ${isAddingPolygon ? "active" : ""}`}
          onClick={handleAddPolygonClick}
        >
          {isAddingPolygon ? "Draw polygon on map" : "Add Polygon"}
        </button>
      </div>
      
      {showForm && (
        <AddPoiForm
          coordinates={selectedCoords}
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedCoords(null);
            setFormData("", "");
          }}
        />
      )}
    </div>
  );
};

export default PoiManagementComponent;