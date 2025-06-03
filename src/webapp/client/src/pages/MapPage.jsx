// pages/MapPage.jsx
import React, { useState } from "react";
import MapComponent from "../components/MapComponent";
import { useFetchPois } from "../hooks/useFetchData";
import "../css/map.css";
import PoiListReadOnlyComponent from "../components/PoiListReadOnlyComponent";

const MapPage = () => {
  const { data, loading, error } = useFetchPois();
  const [selectedPoiIds, setSelectedPoiIds] = useState([]);

  const handleSelectionChange = (ids) => {
    setSelectedPoiIds(ids);
  };

  const handleExport = async () => {
    try {
      const query = selectedPoiIds.map(id => `poiIds=${id}`).join("&");
      const res = await fetch(`/api/app/default/export/pois?${query}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "exported_pois.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="map-page">
      <button 
        className="itinerary-button"
        onClick={() => {
          alert("qui dovrai far vedere l'itinerario e il tasto salva");
        }}
      >
        Visualizza itinerario 
      </button>

      <MapComponent data={data} />

      <PoiListReadOnlyComponent 
        pois={data}
        onDelete={ _ => {alert("POI deleted") }}
      />
    </div>
  );
};

export default MapPage;
