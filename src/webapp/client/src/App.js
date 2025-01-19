import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import MapPage from "./pages/MapPage";
import PoiManagement from "./pages/PoiManagement";
import Login from "./pages/authn/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import "./App.css";
import { useAuthnContext } from "./hooks/useAuthnContext";
import Protected from "./pages/Protected";

function App() {
  const { user } = useAuthnContext();
  console.log(user);
  return (
    <BrowserRouter>
        <div className="app">
          <Sidebar />
          <div className="content">
            <Routes>
            {//debugging purpose only
            user ? 
            console.log("usr: "+user) : console.log("no user")}

              <Route path="/" element={<Dashboard />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/poi-management" element={<PoiManagement />}/>
              <Route path="/settings" element={<Settings />} />
              <Route path="/dashboard" element={<Protected />} />
              <Route path="/login" element={<Login/>}></Route>
            </Routes>
          </div>
        </div>
    </BrowserRouter>
  );
}

export default App;
