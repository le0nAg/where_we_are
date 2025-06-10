import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import MapPage from "./pages/MapPage";
import PoiManagementPage from "./pages/PoiManagementPage";
import Login from "./pages/authn/Login";
import "./css/app.css";
import  AuthnProvider  from "../src/context/AuthnContext";
// import { AuthnContext } from '../context/AuthnContext';
import { ProtectedRoute, OperatorRoute } from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import StatisticalPage from "./pages/StatisticalPage";

function App() {
  return (
    <BrowserRouter>
      <AuthnProvider>
        <Routes>
          
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/stats" element={<StatisticalPage />} />
          <Route path="/poi-management" element={<PoiManagementPage />} />
          
        </Routes>
      </AuthnProvider>
    </BrowserRouter>
  );
}

export default App;