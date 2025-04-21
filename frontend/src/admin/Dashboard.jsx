import React from "react";
import logo from "../assets/logo.webp";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/util.js";

const Dashboard = () => {
  const handleAdminLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
        withCredentials: true,
      });

      toast.success(response.data.message);
      localStorage.removeItem("admin");
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-black to-blue-950 py-8 px-4">
      {/* Top Section with Logo */}
      <div className="flex flex-col items-center mb-10">
        <img src={logo} alt="Profile" className="rounded-full mt-2 h-20 w-20" />
        <h2 className="text-lg font-bold text-white mt-4">Dashboard</h2>
      </div>

      {/* Navigation Buttons */}
      <nav className="flex flex-col items-center space-y-4 w-full">
        <Link to="/admin/our-courses">
          <button className="w-72 sm:w-80 bg-green-700 hover:bg-green-600 text-white py-2 cursor-pointer rounded">
            Our Courses
          </button>
        </Link>
        <Link to="/admin/create-course">
          <button className="w-72 sm:w-80 bg-green-700 hover:bg-green-600 text-white py-2 cursor-pointer rounded">
            Create Course
          </button>
        </Link>
        <Link to="/">
          <button className="w-72 sm:w-80 bg-green-700 hover:bg-green-600 text-white py-2 cursor-pointer rounded">
            Home
          </button>
        </Link>
        <Link to="/admin/login">
          <button
            onClick={handleAdminLogout}
            className="w-72 sm:w-80 bg-green-700 hover:bg-green-600 text-white py-2 cursor-pointer rounded"
          >
            Logout
          </button>
        </Link>
      </nav>

      {/* Welcome Text */}
      <div className="flex items-center justify-center text-white font-bold text-2xl mt-14 text-center">
        Welcome Admin!!!
      </div>
    </div>
  );
};

export default Dashboard;
