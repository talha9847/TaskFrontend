import { Menu, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../src/Context/autheContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-800">
              {user?.role}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <a
              href="/dashboard"
              className="flex items-center space-x-2 text-sm text-gray-700"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </a>

            <button
              onClick={logout}
              className="flex items-center space-x-2 text-sm text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
