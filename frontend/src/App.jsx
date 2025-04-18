import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import Courses from "./components/Courses";
import Purchases from "./components/Purchases";
import Buy from "./components/Buy";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import CreateCourse from "./admin/CreateCourse";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourses from "./admin/OurCourses";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/courses" element={<Courses />}></Route>
        <Route
          path="/purchases"
          element={
            <ProtectedUserRoute>
              <Purchases />
            </ProtectedUserRoute>
          }
        ></Route>
        <Route path="/buy/:courseId" element={<Buy />}></Route>
        {/* Admin route */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/admin/create-course" element={<CreateCourse />} />
        <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
        <Route path="/admin/our-courses" element={<OurCourses />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
