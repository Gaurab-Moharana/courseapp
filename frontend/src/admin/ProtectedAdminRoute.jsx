import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  try {
    const adminData = localStorage.getItem("admin");
    const admin = JSON.parse(adminData);

    if (admin && admin.email && admin.token) {
      return children;
    } else {
      return <Navigate to="/admin/login" />;
    }
  } catch (error) {
    return <Navigate to="/admin/login" />;
  }
};

export default ProtectedAdminRoute;
