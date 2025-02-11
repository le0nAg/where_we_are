import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { FeatureGroup } from "react-leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import AddPoiForm from "./AddPoiForm";
import ShowPoiComponent from "./ShowPoiComponent";
import "../css/poiManagement.css";
import usePostPoi from "../hooks/usePostPoi";
import PoiListComponent from "./PoiListComponent";
import { useFetchPois } from "../hooks/useFetchData";

const PoiManagementComponent = ({ pois: initialPois, onAddPolygon }) => {
  const [pois, setPois] = useState(initialPois);
  const [isAddingPolygon, setIsAddingPolygon] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const { postPoi, isLoading: isSaving, error: saveError } = usePostPoi();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { fetchPois } = useFetchPois(); 

  const refreshPois = async () => {
    try {
      const updatedPois = await fetchPois();
      setPois(updatedPois);
    } catch (err) {
      console.error("Error fetching updated POIs:", err);
    }
  };

  useEffect(() => {
    refreshPois();
  }, );

  const handleDeletePoi = async (deletedPoiIds) => {
    try {
      const updatedPois = pois.filter(poi => !deletedPoiIds.includes(poi._id));
      setPois(updatedPois);

      await refreshPois();
    } catch (err) {
      console.error("Error updating POI list after deletion:", err);
    }
  };

  const handleAddPolygonClick = () => {
    setIsAddingPolygon(true);
    setShowForm(false);
  };

  const handleCreatedPolygon = (e) => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();
    const convertCoordinates = (coords) => {
      return coords[0].map(coord => [coord[1], coord[0]]);
    };
    setSelectedPolygon({
      ...geojson,
      geometry: {
        ...geojson.geometry,
        coordinates: [convertCoordinates(geojson.geometry.coordinates)]
      }
    });
    setIsAddingPolygon(false);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
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

    try {
      const savedPoi = await postPoi(newPoi);
      setPois((prevPois) => [...prevPois, savedPoi]);
      onAddPolygon(savedPoi);
      setShowForm(false);
      setFormData({ name: "", description: "" });
      setSelectedPolygon(null);
    } catch (err) {
      console.error("Error saving POI:", err);
    }
  };

  return (
    <div className="poi-management-container">
      <div className="top-bar">
        <div className="logo-container">
          <img src="/logo_64.png" alt="error" />
          <span className="brand-name">WhereWeAre</span>
        </div>
        <div className="auth-container">
          <button className="auth-button">Logout</button>
        </div>
      </div>

      <div className={`poi-sidebar ${sidebarOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-controls">
          <button className="toggle-sidebar-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
        </div>
        <PoiListComponent pois={pois} onDelete={handleDeletePoi} />
      </div>

      <MapContainer center={[46.0667, 11.1211]} zoom={14} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {pois.map((poi, i) => (
          <Polygon
            key={i}
            positions={poi.geometry.coordinates}
            pathOptions={{ color: "purple" }}
            eventHandlers={{ click: () => setSelectedPoi(poi) }}
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
          isSaving={isSaving}
          error={saveError}
        />
      )}

      {selectedPoi && <ShowPoiComponent poi={selectedPoi} onClose={() => setSelectedPoi(null)} />}
    </div>
  );
};

export default PoiManagementComponent;