import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element: Component }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return Component;
};

export default ProtectedRoute;
