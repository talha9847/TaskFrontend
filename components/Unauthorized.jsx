import { useState } from "react";
import { ShieldX, ArrowLeft, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      console.log("Redirecting to home page...");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>

        <div className="text-6xl font-bold text-red-600 mb-4">401</div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          You don't have permission to access this page. Please log in with
          appropriate credentials or go back to the previous page.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-black   text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Login
          </Link>

          <button
            onClick={handleGoBack}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
