import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import MapPage from "./pages/MapPage";
import PoiManagement from "./pages/PoiManagement";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/poi-management" element={<PoiManagement />}/>
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const headerStyle = {
  backgroundColor: "#282c34",
  color: "white",
  padding: "1rem",
  textAlign: "center",
};

export default App;
