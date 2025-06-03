// pages/MapPage.jsx
import React, { useState } from "react";
import MapComponent from "../components/MapComponent";
import { useFetchPois } from "../hooks/useFetchData";
import "../css/map.css";
import PoiListComponent from "../components/PoiListComponent";
import Header from '../components/header';

const MapPage = () => {
  const { data, loading, error } = useFetchPois();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;


  return (
    <div className="map-page">

      <div className={`poi-sidebar ${sidebarOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-controls">
          <button className="toggle-sidebar-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
        </div>
        <PoiListComponent 
          pois={data}
          onAction={ _ => {alert("POI to save") }}
          selectedButtonName="Salva"
        />
      </div>

      <MapComponent data={data} />

    </div>
  );
};

export default MapPage;
