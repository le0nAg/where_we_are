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

  //handler per interrogare il backend per il download del KML
  const downloadKML = async (selectedPois) => {
    try {
      console.log(selectedPois);
      const poiIds = selectedPois.map(poi => poi).join(',');
      const response = await fetch(`/api/app/download?pois=${poiIds}`);
      
      if (!response.ok) {
        throw new Error('Failed to download KML');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pois.kml';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error downloading KML: ' + error.message);
    }
  };
  
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
          onAction={downloadKML}
          selectedButtonName="Salva"
        />
      </div>

      <MapComponent data={data} />

    </div>
  );
};

export default MapPage;
