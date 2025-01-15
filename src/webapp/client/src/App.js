import React from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import MapPage from "./pages/MapPage";
import Login from "./pages/authn/Login";
import HomeSample from "./pages/authn/HomeSample";
import AuthProvider from "./context/AuthnContext";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/" element={<HomeSample />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
