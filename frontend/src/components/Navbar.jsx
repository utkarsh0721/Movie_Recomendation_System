import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Film,
  Heart,
  List,
  LogOut,
  Menu,
  X,
  Compass,
  Home,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/explore", label: "Explore", icon: Compass },
  ];

  const userLinks = [
    { path: "/favorites", label: "Favorites", icon: Heart },
    { path: "/watchlist", label: "Watchlist", icon: List },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div
              className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 
                          group-hover:from-primary-400 group-hover:to-accent-400 transition-all duration-300"
            >
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">CineAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, label, icon }) => {
              const Icon = icon;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
                            ${
                              isActive(path)
                                ? "bg-dark-700 text-white"
                                : "text-dark-400 hover:text-white hover:bg-dark-800"
                            }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </Link>
              );
            })}

            {user &&
              userLinks.map(({ path, label, icon }) => {
                const Icon = icon;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
                            ${
                              isActive(path)
                                ? "bg-dark-700 text-white"
                                : "text-dark-400 hover:text-white hover:bg-dark-800"
                            }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{label}</span>
                  </Link>
                );
              })}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl 
                           bg-dark-800 hover:bg-dark-700 transition-all duration-300"
                  aria-label="User menu"
                  aria-expanded={isProfileMenuOpen}
                >
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 
                                flex items-center justify-center"
                  >
                    <span className="text-sm font-bold text-white">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="font-medium text-white">{user.name}</span>
                </button>

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 py-2 bg-dark-800 rounded-xl 
                                border border-dark-700 shadow-xl animate-scale-in"
                  >
                    <div className="px-4 py-2 border-b border-dark-700">
                      <p className="text-sm text-dark-400">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-left
                               text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-dark-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-dark-400 hover:text-white 
                     hover:bg-dark-800 transition-all duration-300"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-dark-700 bg-dark-900 animate-slide-up">
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-64px)] overflow-y-auto">
            {navLinks.map(({ path, label, icon }) => {
              const Icon = icon;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                            ${
                              isActive(path)
                                ? "bg-dark-700 text-white"
                                : "text-dark-400 hover:text-white hover:bg-dark-800"
                            }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              );
            })}

            {user && (
              <>
                <div className="border-t border-dark-700 my-2 pt-2 space-y-2">
                  {userLinks.map(({ path, label, icon }) => {
                    const Icon = icon;
                    return (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                                  ${
                                    isActive(path)
                                      ? "bg-dark-700 text-white"
                                      : "text-dark-400 hover:text-white hover:bg-dark-800"
                                  }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                      </Link>
                    );
                  })}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                           text-red-400 hover:text-red-300 hover:bg-dark-800 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            )}

            {!user && (
              <div className="border-t border-dark-700 my-2 pt-2 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-xl
                           text-dark-300 hover:text-white hover:bg-dark-800 transition-all font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
