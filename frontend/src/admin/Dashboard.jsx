import React from "react";
import logo from "../assets/logo.webp";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/util.js";


const Dashboard = () => {
  const handleAdminLogout = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/admin/logout`,
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      localStorage.removeItem("admin");
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  return (
    <div className="flex h-screen  bg-gradient-to-r from-black to-blue-950">
      {/* Sidebar */}
      <div className="w-64 bg-blue-950 p-5">
        <div className="flex items-center flex-col mb-10">
          <img src={logo} alt="Profile" className="rounded-full h-20 w-20" />
          <h2 className="text-lg font-bold text-white mt-4">Admin</h2>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link to={"/admin/our-courses"}>
            <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 cursor-pointer rounded">
              Our Courses
            </button>
          </Link>
          <Link to={"/admin/create-course"}>
            <button className="w-full  bg-green-700 hover:bg-green-600 text-white py-2 cursor-pointer rounded ">
              Create Course
            </button>
          </Link>
          <Link to={"/"}>
            <button className="w-full  bg-green-700 hover:bg-green-600 text-white py-2 cursor-pointer rounded ">
              Home
            </button>
          </Link>
          <Link to={"/admin/login"}>
            <button
              onClick={handleAdminLogout}
              className="w-full  bg-green-700 hover:bg-green-600 text-white py-2 cursor-pointer rounded"
            >
              Logout
            </button>
          </Link>
        </nav>
      </div>
      <div className="flex h-screen items-center justify-center text-white ml-0 md:ml-[40%]">
        Welcome!!!
      </div>
    </div>
  );
};

export default Dashboard;
