import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PrivateRoute = () => {
  const { user } = useAuth(); // Assicurati di estrarre user dal contesto
  const isAuthenticated = !!user; // Controlla se l'utente è loggato
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;