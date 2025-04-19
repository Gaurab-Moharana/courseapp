import React, { useState } from "react";
import logo from "../assets/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../utils/util.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Login successfull");

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: response.data.user.email,
          firstName: response.data.user.firstName,
          token: response.data.token,
        })
      );

      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errors || "Login failed!!!");
      }
    }
  };
  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen text-white">
      {/* Header */}
      <header className="flex flex-row justify-between sm:flex-row sm:items-center sm:justify-between px-4 py-4 gap-4 sm:gap-0">
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="CourseHub Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          />
          <Link to={"/"} className="text-lg sm:text-xl md:text-2xl font-bold ">
            CourseHub
          </Link>
        </div>
        <div className="flex flex-row sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0  items-start gap-2 sm:items-center">
          <Link
            to="/signup"
            className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-white duration-300 hover:text-black"
          >
            Signup
          </Link>
          <Link
            to="/login"
            className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-white duration-300 hover:text-black"
          >
            Join now
          </Link>
        </div>
      </header>

      {/* Signup Form Placeholder (centered) */}
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
        <div className="bg-gray-900 text-white rounded-lg p-8 w-full max-w-md shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-6">
            Welcome to <span className="text-green-500">CourseHub</span>
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Please login to access courses
          </p>
          {/* Replace below with your form */}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border rounded mb-4"
              required
            />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-white hover:text-black duration-300 cursor-pointer font-bold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
