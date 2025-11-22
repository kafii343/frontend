import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const RoleBasedRoute = ({ children, requireAdmin = false }: RoleBasedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated admin tries to access user routes, redirect to admin dashboard
  if (isAuthenticated && isAdmin && !requireAdmin && location.pathname !== '/admin' && !location.pathname.startsWith('/admin/')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If non-admin tries to access admin routes, redirect to home
  if (isAuthenticated && !isAdmin && requireAdmin) {
    return <Navigate to="/" replace />;
  }

  // If non-admin tries to access any admin route (starts with /admin but is not admin)
  if (isAuthenticated && !isAdmin && location.pathname.startsWith('/admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;