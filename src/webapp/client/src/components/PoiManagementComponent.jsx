import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { FeatureGroup } from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AddPoiForm from "./AddPoiForm";
import "../css/PoiManagement.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const PoiManagementComponent = ({ pois, onAddPoi, onAddPolygon }) => {
  const [isAddingPolygon, setIsAddingPolygon] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  const handleAddPolygonClick = () => {
    setIsAddingPolygon(true);
    setShowForm(false);
  };

  const handleCreatedPolygon = (e) => {
    const layer = e.layer;
    const polygon = layer.toGeoJSON();
    setSelectedPolygon(polygon);
    setIsAddingPolygon(false);
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !selectedPolygon) return;

    const newPoi = {
      type: "Feature",
      geometry: selectedPolygon.geometry,
      properties: {
        ...formData,
        images: [],
        osmTags: {},
        category: "area",
      },
    };

    onAddPolygon(newPoi);
    setShowForm(false);
    setFormData({ name: "", description: "" });
    setSelectedPolygon(null);
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

        {/* Existing Polygon POIs */}
        {pois.filter(p => p.geometry.type === "Polygon").map((poi, i) => (
          <Polygon
            key={i}
            positions={poi.geometry.coordinates}
            pathOptions={{ color: "purple" }}
          >
            <Popup>
              <h3>{poi.properties.name}</h3>
              <p>{poi.properties.description}</p>
              {poi.properties.images?.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`${idx}`}
                  style={{ width: "100px", margin: "5px" }}
                />
              ))}
            </Popup>
          </Polygon>
        ))}

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
      </MapContainer>

      <div className="map-controls">
        <button
          className={`add-polygon-button ${isAddingPolygon ? "active" : ""}`}
          onClick={handleAddPolygonClick}
        >
          {isAddingPolygon ? "Draw polygon on map" : "Add Area"}
        </button>
      </div>
      
      {showForm && (
        <AddPoiForm
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedPolygon(null);
            setFormData({ name: "", description: "" });
          }}
        />
      )}
    </div>
  );
};

export default PoiManagementComponent;