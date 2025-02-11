import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import MapPage from "./pages/MapPage";
import PoiManagementPage from "./pages/PoiManagementPage";
import Login from "./pages/authn/Login";
import Settings from "./pages/Settings";
import "./css/app.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/authn/check-auth", {
          credentials: "include",
        });

        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // TODO: styling
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <div className="content">
          <Routes>
            <Route path="/map" element={<MapPage />} />

            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />

            <Route
              path="/poi-management"
              element={
                isAuthenticated ? (
                  <PoiManagementPage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/settings"
              element={
                isAuthenticated ? (
                  <Settings />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/poi-management" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;