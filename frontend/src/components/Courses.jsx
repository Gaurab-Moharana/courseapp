import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload } from "react-icons/fa6";
import { HiX, HiMenu } from "react-icons/hi";
import { IoLogOut, IoLogIn } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/util.js";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      console.error("Error in logging out:", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setFilteredCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("Error in fetching courses: " + error);
      }
    };
    fetchCourses();
  }, []);

  const handleSearch = () => {
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}

      {/* Menu button (only shows when sidebar is closed on mobile) */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-[999] text-white bg-gray-800 hover:bg-gray-700 transition-colors p-2 rounded-full shadow-lg"
        >
          <HiMenu className="text-3xl" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bg-blue-950 h-screen w-64 p-5 transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Close Icon inside Sidebar (mobile only) */}
        <div className="flex justify-end md:hidden">
          <button onClick={toggleSidebar} className="text-white text-3xl mb-6">
            <HiX />
          </button>
        </div>

        <nav>
          <ul>
            <li className="mb-4">
              <Link
                to="/"
                className="flex items-center text-white hover:text-gray-500 duration-300"
              >
                <RiHome2Fill className="mr-2" />
                Home
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/courses"
                className="flex items-center text-white hover:text-gray-500 duration-300"
              >
                <FaDiscourse className="mr-2" />
                Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/purchases"
                className="flex items-center text-white hover:text-gray-500 duration-300"
              >
                <FaDownload className="mr-2" />
                Purchases
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center text-white hover:text-gray-500 duration-300"
                >
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center text-white hover:text-gray-500 duration-300"
                >
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="bg-gradient-to-r from-black to-blue-950 ml-0 md:ml-64 w-full p-6 md:p-10">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="flex items-center space-x-3 w-full md:w-[60%]">
            <div className="flex items-center w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type here to search..."
                className="border border-gray-300 text-white bg-transparent rounded-l-full px-4 py-2 h-10 w-80 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="h-10 border border-gray-300 rounded-r-full px-4 flex items-center justify-center"
              >
                <FiSearch className="text-xl text-gray-600 hover:cursor-pointer hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Heading below search bar */}
        <h1 className="text-3xl font-bold font-sans text-white mb-6">
          Courses
        </h1>

        {/* Courses Section */}
        <div className="overflow-y-scroll h-[75vh] pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thumb-rounded">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filteredCourses.length === 0 ? (
            <p className="text-center text-gray-500">No courses found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="border flex flex-col items-center border-gray-200 bg-gray-900 rounded-lg p-4 shadow-sm"
                >
                  <img
                    src={course?.image?.url}
                    alt={course.title}
                    className="rounded w-[7.5rem] mb-3"
                  />
                  <h2 className="text-lg font-bold mt-2 mb-2 text-white text-center">
                    {course.title}
                  </h2>
                  <p className="text-white text-center mt-2 mb-3">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="flex justify-between items-center w-full mb-4">
                    <span className="font-bold text-xl text-white">
                      ₹{course.price}{" "}
                      <span className="text-gray-400 line-through">5999</span>
                    </span>
                    <span className="text-green-600 font-semibold">
                      20% off
                    </span>
                  </div>
                  <Link
                    to={`/buy/${course._id}`}
                    className="bg-green-600 w-full mt-4 text-center font-bold text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black duration-300"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses;
