import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Shield, Mountain, MapPin } from "lucide-react"; // Mountain dihapus
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Beranda", href: "/" },
    { name: "Open Trip", href: "/open-trip" },
    { name: "Guide", href: "/guide" },
    { name: "Porter", href: "/porter" },
    { name: "Tentang", href: "/about" },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 glass-nav shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/logome.png" // ganti sesuai nama file logomu di folder public
              alt="Carten'z Logo"
              className="h-9 w-auto object-contain"
            />
            <span className="font-bold text-xl text-foreground">
              Carten<span className="text-red-500">'z</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-gray-700 hover:text-primary hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Button asChild variant="outline" size="sm" className="border-primary/30 hover:bg-primary/5 text-primary">
                    <Link to="/admin" className="flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      Admin
                    </Link>
                  </Button>
                )}
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-forest-light flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden sm:inline">{user?.username}</span>
                  </Button>
                  <div className="absolute right-0 mt-1 w-52 glass-card rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-200">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 rounded-lg mx-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="border-primary/30 hover:bg-primary/5 text-primary font-medium">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="adventure" size="sm" className="font-medium shadow-md hover:shadow-lg transition-shadow">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
            
            {isAuthenticated && (
              <Button asChild variant="adventure" size="sm" className="font-medium shadow-md hover:shadow-lg transition-shadow">
                <Link to="/booking" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Pesan Sekarang
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden glass-card shadow-lg rounded-b-xl mb-2">
            <div className="px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 pb-1 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-3 text-base font-medium rounded-lg transition-colors text-gray-700 hover:text-primary hover:bg-gray-100 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-forest-light flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-800">{user?.username}</span>
                      </div>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-base font-medium rounded-lg transition-colors text-gray-700 hover:text-primary hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 text-base font-medium rounded-lg transition-colors text-gray-700 hover:text-primary hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-3 pb-2">
                {isAuthenticated ? (
                  <Button
                    asChild
                    variant="adventure"
                    size="sm"
                    className="w-full font-medium shadow-md"
                  >
                    <Link to="/booking" className="flex items-center justify-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Pesan Sekarang
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="adventure"
                    size="sm"
                    className="w-full font-medium shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/booking" className="flex items-center justify-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Pesan Sekarang
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
