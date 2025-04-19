import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoLogOut, IoLogIn } from "react-icons/io5";
import { HiX, HiMenu } from "react-icons/hi";
import { BACKEND_URL } from "../utils/util.js";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsLoggedIn(!!parsedUser.token);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message || "Logged out successfully!");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      window.location.href = "/";
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const fetchPurchases = async () => {
      if (!token) {
        setErrorMessage("Please login to purchase the course");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/user/purchases`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch purchases");
        }

        const data = await response.json();
        setPurchases(data.courseData || []);
      } catch (error) {
        console.error("Error fetching purchases:", error);
        setErrorMessage("Failed to fetch purchases");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}

      <div
        className={`fixed inset-y-0 left-0 bg-blue-950 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        {/* Close Icon inside Sidebar (mobile only) */}
        <div className="flex justify-end md:hidden">
          <button onClick={toggleSidebar} className="text-white text-3xl mb-6">
            <HiX />
          </button>
        </div>

        <nav>
          <ul className="mt-10 md:mt-0">
            <li className="mb-4">
              <Link
                to="/"
                className="flex items-center text-white hover:text-gray-400"
              >
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/courses"
                className="flex items-center text-white hover:text-gray-400"
              >
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="#"
                className="flex items-center text-white hover:text-gray-400"
              >
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-white hover:text-gray-400"
                >
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center text-white hover:text-gray-400"
                >
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 bg-gradient-to-r from-black to-blue-950 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64 overflow-auto`}
      >
        <h2 className="text-xl text-white font-bold mb-6">My Purchases</h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {loading ? (
          <p className="text-white">Loading purchases...</p>
        ) : purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((purchase, index) => (
              <div key={index} className="bg-gray-800 rounded-xl shadow-lg p-4">
                <img
                  className="rounded-lg w-full h-48 object-cover mb-4"
                  src={purchase.image?.url || "https://via.placeholder.com/200"}
                  alt={purchase.title}
                />
                <h3 className="text-lg text-white font-semibold">
                  {purchase.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {purchase.description?.slice(0, 80)}...
                </p>
                <span className="text-green-500 font-bold">
                  ₹{purchase.price} only
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no purchases yet.</p>
        )}
      </div>
    </div>
  );
};

export default Purchases;
