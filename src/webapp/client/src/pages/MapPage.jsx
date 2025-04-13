import React from "react";
import MapComponent from "../components/MapComponent";
import { useFetchPois } from "../hooks/useFetchData";
import { useAuthnContext } from "../hooks/useAuthnContext";
import "../css/map.css";

const MapPage = () => {
  const { data, loading, error } = useFetchPois();
  const { user, isAuthenticated } = useAuthnContext();

  const handleGoogleLogin = () => {
    // Redirect to your backend's Google auth route
    window.location.href = 'http://localhost:5000/auth/google';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
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
        ) : (
          <div className="user-info">
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className="profile-image" 
            />
            <span>Welcome, {user.displayName}</span>
          </div>
        )}
      </div>
      <MapComponent data={data} />
    </div>
  );
};

export default MapPage;