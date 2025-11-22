import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminOpenTrips from "@/components/Admin/AdminOpenTrips";

const AdminOpenTripsPage = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Double-check if user is admin, redirect if not
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Open Trip Management</h1>
      <AdminOpenTrips />
    </div>
  );
};

export default AdminOpenTripsPage;