import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrFormViewHide } from "react-icons/gr";
import { BiShowAlt } from "react-icons/bi";
import api from "../Services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("name", response.data.user.name);
      localStorage.setItem("userId", response.data.user._id);
      toast.success(response.data.message);
      navigate("/chat");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="bg-gradient-to-r from-green-400 via-lime-500 to-teal-500 min-h-screen flex items-center justify-center">
      <div className="w-11/12 sm:w-3/4 lg:w-1/2 bg-white shadow-xl rounded-lg border-t-8 border-blue-400 overflow-hidden">
        <div className="p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Log In</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
         
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-lg font-semibold text-blue-500 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 shadow focus:ring focus:ring-blue-300"
              />
            </div>

          
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-lg font-semibold text-blue-500 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 shadow pr-12 focus:ring focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? <BiShowAlt /> : <GrFormViewHide />}
                </button>
              </div>
            </div>

      
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-lg py-3 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Log In
              </button>
            </div>

        
            <div className="flex justify-between items-center text-blue-500 mt-4">
              <Link to="/register" className="hover:underline">
                Don't have an account? Register
              </Link>
              <Link to="/forgot-password" className="hover:underline">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
