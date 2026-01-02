import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../src/Context/autheContext";
import { Loader2, Lock, User } from "lucide-react";

const Login = () => {
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const formSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await axios.post(`${BASE_URL}/api/User/Login`, {
        email: data.email,
        password: data.password,
      });
      if (result.status == 200) {
        const token = result.data.token;
        const role = result.data.role;
        login({ token, role });
        toast.success("Login Successfull");
        setLoading(false);
        navigate("/employee");
      } else {
        toast.error("Invalid Credentials");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Internal server error");
      setLoading(false);
    }
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-gray-100 min-h-[88.5vh] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(formSubmit)}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  {...register("email", {
                    required: "Email is required",
                  })}
                  type="text"
                  placeholder="Enter your email or mobile"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-md focus:border-black text-sm"
                />
              </div>

              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Lock className="h-5 w-5" />
                </div>

                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 5,
                      message: "At least 6 character",
                    },
                  })}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-md focus:border-black text-sm"
                />
              </div>

              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-black text-white font-medium rounded-md shadow-md hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
            >
              {!loading ? (
                "Sign in"
              ) : (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <span className="text-sm">Signing in...</span>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
