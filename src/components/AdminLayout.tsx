import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Mountain, 
  UsersRound,
  Briefcase,
  LogOut,
  Menu,
  X 
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Toggle sidebar on mobile
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Mountains", path: "/admin/mountains", icon: Mountain },
    { name: "Open Trips", path: "/admin/open-trips", icon: Mountain },
    { name: "Guides", path: "/admin/guides", icon: UsersRound },
    { name: "Porters", path: "/admin/porters", icon: Briefcase },
    { name: "Bookings", path: "/admin/bookings", icon: Mountain },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed md:static z-40 h-full bg-white shadow-lg transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"} 
          flex flex-col`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <img
              src="/logome.png"
              alt="Carten'z Logo"
              className={`h-9 w-auto object-contain ${!isSidebarOpen ? "mx-auto" : ""}`}
            />
            {isSidebarOpen && (
              <span className="font-bold text-xl text-foreground">
                Carten<span className="text-red-500">'z</span>
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent"
                    } ${!isSidebarOpen ? "justify-center" : ""}`}
                  >
                    <Icon className={`h-5 w-5 ${!isSidebarOpen ? "mx-auto" : "mr-3"}`} />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="text-sm">
                <p className="font-medium truncate">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              className={!isSidebarOpen ? "mx-auto" : ""}
            >
              <LogOut className={`h-4 w-4 ${!isSidebarOpen ? "mx-auto" : "mr-2"}`} />
              {isSidebarOpen && <span className="sr-only">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-0" : "md:ml-20"}`}>
        <div className="h-full overflow-auto">
          {children || <Outlet />}
        </div>
      </main>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;