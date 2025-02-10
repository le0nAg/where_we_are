import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { FeatureGroup } from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import AddPoiForm from "./AddPoiForm";
import ShowPoiComponent from "./ShowPoiComponent";
import "../css/poiManagement.css";

const PoiManagementComponent = ({ pois, onAddPolygon }) => {

  const [isAddingPolygon, setIsAddingPolygon] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [selectedPoiId, setSelectedPoiId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);  // Aggiunto lo stato per la sidebar

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
      <div className="sidebar-controls">
        <button className="toggle-sidebar-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
      </div>

      <div className={`poi-sidebar ${sidebarOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <h2>Lista POI</h2>
        <ul>
          {pois.map((poi) => (
            <li key={poi._id} onClick={() => setSelectedPoiId(poi._id)}>
              {poi.properties.name}
            </li>
          ))}
        </ul>
      </div>

      <MapContainer center={[46.0667, 11.1211]} zoom={14} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {pois.map((poi, i) => (
          <Polygon
            key={i}
            positions={poi.geometry.coordinates}
            pathOptions={{ color: "purple" }}
            eventHandlers={{ click: () => setSelectedPoiId(poi._id) }}
          />
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
          {isAddingPolygon ? "Disegna un poligono" : "Aggiungi Area"}
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

      {selectedPoiId && <ShowPoiComponent poiId={selectedPoiId} onClose={() => setSelectedPoiId(null)} />}
    </div>

  );
};

export default PoiManagementComponent;
