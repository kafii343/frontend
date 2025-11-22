import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import OpenTrip from "./pages/OpenTrip";
import Guide from "./pages/Guide";
import Porter from "./pages/Porter";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import BookingPending from "./pages/BookingPending";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Header from "@/components/Header"; // Ganti ke Header
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import AdminLayout from "@/components/AdminLayout";
import UserLayout from "@/components/UserLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminGuides from "./pages/Admin/AdminGuides";
import AdminPorters from "./pages/Admin/AdminPorters";
import AdminBookings from "./pages/Admin/AdminBookings";
import AdminOpenTripsPage from "./pages/Admin/AdminOpenTrips";
import AdminMountains from "./pages/Admin/AdminMountains";
import RoleBasedRoute from "@/components/RoleBasedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes with AdminLayout - Only accessible by admins */}
            <Route path="/admin" element={
              <RoleBasedRoute requireAdmin={true}>
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              </RoleBasedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="open-trips" element={<AdminOpenTripsPage />} />
              <Route path="guides" element={<AdminGuides />} />
              <Route path="porters" element={<AdminPorters />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="mountains" element={<AdminMountains />} />
            </Route>
            
            {/* User Routes with UserLayout - Only accessible by non-admin users */}
            <Route element={
              <RoleBasedRoute>
                <UserLayout />
              </RoleBasedRoute>
            }>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/open-trip" element={
                <ProtectedRoute>
                  <OpenTrip />
                </ProtectedRoute>
              } />
              <Route path="/guide" element={
                <ProtectedRoute>
                  <Guide />
                </ProtectedRoute>
              } />
              <Route path="/porter" element={
                <ProtectedRoute>
                  <Porter />
                </ProtectedRoute>
              } />
              <Route path="/booking" element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } />
              <Route path="/booking-success" element={
                <ProtectedRoute>
                  <BookingSuccess />
                </ProtectedRoute>
              } />
              <Route path="/booking-pending" element={
                <ProtectedRoute>
                  <BookingPending />
                </ProtectedRoute>
              } />
              <Route path="/about" element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch all route - handles undefined routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;