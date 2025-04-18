import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedUserRoute = ({ children }) => {
  try {
    const userData = localStorage.getItem("user");
    const user = JSON.parse(userData);

    if (user && user.email && user.token) {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
  } catch (error) {
    return <Navigate to="/login" />;
  }
};

export default ProtectedUserRoute;
