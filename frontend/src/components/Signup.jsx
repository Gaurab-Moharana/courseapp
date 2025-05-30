import React, { useState } from "react";
import logo from "../assets/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../utils/util.js";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/signup`,
        {
          firstName,
          lastName,
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

      toast.success(response.data.message || "Signup successfull");

      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errors.forEach((err) => toast.error(err));
        } else {
          toast.error(errors);
        }
      } else {
        toast.error("Signup failed!!!");
      }
    }
  };
  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen text-white">
      {/* Header */}
      <header className="flex flex-row justify-between sm:items-center px-4 py-4 gap-2 sm:gap-0">
        <div className="flex items-center space-x-2">
          <img
            src={logo}
            alt="CourseHub Logo"
            className="w-7 h-7 sm:w-10 sm:h-10 rounded-full"
          />
          <Link
            to={"/"}
            className="text-base sm:text-xl md:text-2xl font-bold "
          >
            CourseHub
          </Link>
        </div>
        <div className="flex flex-row flex-wrap sm:space-x-4 space-x-2 items-start sm:items-center">
          <Link
            to="/login"
            className="border border-white text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-white hover:text-black"
          >
            Login
          </Link>
          <Link
            to="/login"
            className="border border-white text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-white hover:text-black"
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
          <p className="text-center text-gray-500 mb-6">Signup to join us!</p>
          {/* Replace below with your form */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              id="firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Firstname"
              className="w-full p-2 border rounded mb-4"
              required
            />{" "}
            <input
              type="text"
              id="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Lastname"
              className="w-full p-2 border rounded mb-4"
              required
            />
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
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
