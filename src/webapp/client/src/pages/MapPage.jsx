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
  const { user, isAuthenticated, isRegularUser } = useAuthnContext();
  const { savePoi } = useSavePoi();
  const [showItineraryModal, setShowItineraryModal] = useState(false);

  const handleGoogleLogin = () => {
    // Redirect to your backend's Google auth route
    window.location.href = '/auth/google';
  };

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
        {!isAuthenticated ? (
          <button 
            className="google-login-button" 
            onClick={handleGoogleLogin}
          >
            <img 
              src="/images/google-logo.png" 
              alt="Google logo" 
              className="google-icon"
            />
            Login with Google
          </button>
        ) : isRegularUser ? (
          <div className="user-controls">
            <div className="user-info">
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="profile-image" 
              />
              <span>Welcome, {user.displayName}</span>
            </div>
            <div className="action-buttons">
              <button 
                className="itinerary-button"
                onClick={handleItineraryPlanning}
              >
                Plan Your Itinerary
              </button>
              <a href="/saved-pois" className="saved-pois-link">
                Your Saved POIs ({user.savedPois?.length || 0})
              </a>
            </div>
          </div>
        ) : (
          <div className="operator-notice">
            <p>You're logged in as an operator. <a href="/poi-management">Manage POIs</a></p>
          </div>
        )}
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