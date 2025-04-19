import React, { useEffect, useState } from "react";
import logo from "../assets/logo.webp";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/util.js";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("user");

    if (token) {
      try {
        const parsedUser = JSON.parse(token);

        if (parsedUser && parsedUser.token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("user"); // Clean invalid data
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });

      toast.success(response.data.message || "Logged out successfully!");

      // Ensure token removal
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error in logging out:", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        console.log("Courses Fetched:", response.data);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("Error in fetching courses", error);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = (courseId) => {
    if (isLoggedIn) {
      navigate(`/buy/${courseId}`);
    } else {
      toast.error("Please login to access the course!");
    }
  };

  // Slider settings
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1, initialSlide: 2 },
      },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen text-white">
      {/* Header */}
      <header className="flex flex-row md:flex-row md:items-center md:justify-between px-4 py-4 gap-4 md:gap-0">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-xl sm:text-2xl font-bold">CourseHub</h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 items-start sm:items-center">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="border border-white px-4 py-2 rounded hover:bg-white hover:text-black"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="border border-white px-4 py-2 rounded hover:bg-white hover:text-black"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="border border-white px-4 py-2 rounded hover:bg-white hover:text-black"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl sm:text-6xl font-bold">CourseHub</h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Sharpen your skills with courses created by experts
        </p>
        <div className="mt-8">
          <Link
            to="/courses"
            className="bg-green-500 px-6 py-3 rounded text-white hover:bg-white font-bold hover:text-black"
          >
            Explore Courses
          </Link>
        </div>
      </section>

      {/* Courses Slider */}
      <section className="pb-8 px-2">
        <Slider {...settings}>
          {courses.map((course) => (
            <div key={course._id} className="p-4 text-center">
              <div className="bg-gray-900 rounded-lg border overflow-hidden hover:scale-105 transition-transform">
                <img
                  className="h-40 w-full object-contain bg-gray-900 my-4"
                  src={course?.image?.url}
                  alt={course.title}
                />
                <div className="p-5">
                  <h2 className="text-lg font-bold">{course.title}</h2>
                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="mt-4 bg-green-500 px-4 py-2 rounded-full text-white hover:bg-white cursor-pointer hover:text-black"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Footer */}
      <footer className="text-white px-4 py-8">
        <hr className="border-gray-700 my-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Column 1 */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
              <h1 className="text-2xl font-bold">CourseHub</h1>
            </div>
            <p className="mt-3">Follow us</p>
            <div className="flex space-x-4 mt-2">
              <a href="#">
                <FaFacebook className="text-2xl hover:text-blue-500" />
              </a>
              <a href="#">
                <FaInstagram className="text-2xl hover:text-pink-600" />
              </a>
              <a href="#">
                <FaXTwitter className="text-2xl hover:text-gray-400" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Connect with us</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>Contact: +91 2000345222</li>
              <li>Email: coursehub222@gmail.com</li>
              <li>GitHub: CourseHub</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">© 2025 CourseHub</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Refund & Cancellation</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
