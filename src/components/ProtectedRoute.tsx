import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "isAdmin:", isAdmin, "adminOnly:", adminOnly);
  
  if (!isAuthenticated) {
    // Redirect to login with return url
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect to home if not admin
    console.log("Not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("Access granted to route");
  return <>{children}</>;
};

export default ProtectedRoute;