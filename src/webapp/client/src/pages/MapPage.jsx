// pages/MapPage.jsx
import React, { useState } from "react";
import MapComponent from "../components/MapComponent";
import { useFetchPois } from "../hooks/useFetchData";
import { useAuthnContext } from "../hooks/useAuthnContext";
import { useSavePoi } from "../hooks/useSavePois"; 
import ItineraryModal from "../components/ItineraryModal"; 
import "../css/map.css";

const MapPage = () => {
  const { data, loading, error } = useFetchPois();
  const { isAuthenticated, isRegularUser } = useAuthnContext();
  const { savePoi } = useSavePoi();
  const [showItineraryModal, setShowItineraryModal] = useState(false);

  const handleSavePoi = async (poiId) => {
    if (isAuthenticated && isRegularUser) {
      try {
        await savePoi(poiId);
        // Show success notification
      } catch (error) {
        // Handle error
        console.error("Failed to save POI:", error);
      }
    }
  };

  const handleItineraryPlanning = () => {
    setShowItineraryModal(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="map-page">
      <div className="map-header">
        <button 
          className="itinerary-button"
          onClick={handleItineraryPlanning}
        >
          Plan Your Itinerary
        </button>
      </div>

      <MapComponent 
        data={data} 
        canSavePois={isAuthenticated && isRegularUser}
        onSavePoi={handleSavePoi}
      />

      {showItineraryModal && (
        <ItineraryModal 
          onClose={() => setShowItineraryModal(false)} 
        />
      )}
    </div>
  );
};

export default MapPage;
