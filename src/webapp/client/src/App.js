import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import MapPage from "./pages/MapPage";
import Login from "./pages/authn/Login";
import "./App.css";
import { useAuthnContext } from "./hooks/useAuthnContext";
import Protected from "./pages/Protected";

function App() {
  const { user } = useAuthnContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {user ? (
            <>
              <Route path="/map" element={<MapPage />} />
              <Route path="/dashboard" element={<Protected />} />
              <Route path="*" element={<Navigate to="/map" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
