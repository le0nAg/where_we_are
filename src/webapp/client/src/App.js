import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import MapPage from "./pages/MapPage";
import PoiManagementPage from "./pages/PoiManagementPage";
import Login from "./pages/authn/Login";
import SavedPoisPage from "./pages/SavedPoisPage";
import "./css/app.css";
import  AuthnProvider  from "../src/context/AuthnContext";
// import { AuthnContext } from '../context/AuthnContext';
import { ProtectedRoute, OperatorRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthnProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MapPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* User-only Routes */}
          <Route path="/saved-pois" element={
            <ProtectedRoute>
              <SavedPoisPage />
            </ProtectedRoute>
          } />
          
          {/* Operator-only Routes */}
          <Route path="/poi-management" element={
            <OperatorRoute>
              <PoiManagementPage />
            </OperatorRoute>
          } />
          
          {/* Other routes */}
        </Routes>
      </AuthnProvider>
    </BrowserRouter>
  );
}

export default App;