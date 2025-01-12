import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import MapPage from "./pages/MapPage";
import Login from "./pages/authn/Login";
import HomeSample from "./pages/authn/HomeSample";
import AuthProvider from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  return (
    <div className="App">
      <AuthProvider>
      <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<HomeSample />} />
            </Route>
          </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
