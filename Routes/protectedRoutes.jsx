import { Navigate } from "react-router-dom";
import { useAuth } from "../src/Context/autheContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 text-black animate-spin" />
      </div>
    );
//   if (!isAuthenticated) return <Navigate to="/" />;



  return children;
};

export default ProtectedRoute;
