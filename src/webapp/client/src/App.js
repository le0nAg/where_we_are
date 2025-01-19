import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import MapPage from "./pages/MapPage";
import Login from "./pages/authn/Login";
import "./App.css";
import { useAuthnContext } from "./hooks/useAuthnContext";
import Protected from "./pages/Protected";

function App() {
  const { user } = useAuthnContext();
  console.log(user);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {user ? (
            console.log("usr: "+user),
            <>
              <Route path="/dashboard" element={<Protected />} />
              <Route path="*" element={<Navigate to="/map" />} />
            </>
          ) : (

            console.log("usr: "+user),
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
