import { useState, useEffect } from "react";
import { authAPI, userAPI } from "../api";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContextStore";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data.data);
        setFavorites(
          response.data.data.favorites?.map((f) => f._id || f) || [],
        );
        setWatchlist(response.data.data.watchlist || []);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, ...userData } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setFavorites(userData.favorites || []);
      setWatchlist(userData.watchlist || []);

      toast.success("Welcome back!");
      return { success: true };
    } catch (_error) {
      const message = _error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await authAPI.signup({ name, email, password });
      const { token, ...userData } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setFavorites([]);
      setWatchlist([]);

      toast.success("Account created successfully!");
      return { success: true };
    } catch (_error) {
      const message = _error.response?.data?.message || "Signup failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setFavorites([]);
    setWatchlist([]);
    toast.success("Logged out successfully");
  };

  const addToFavorites = async (movieId) => {
    if (!user) {
      toast.error("Please login to add favorites");
      return false;
    }
    try {
      await userAPI.addToFavorites(movieId);
      setFavorites((prev) => [...prev, movieId]);
      toast.success("Added to favorites!");
      return true;
    } catch (_error) {
      const message =
        _error.response?.data?.message || "Failed to add to favorites";
      toast.error(message);
      return false;
    }
  };

  const removeFromFavorites = async (movieId) => {
    try {
      await userAPI.removeFromFavorites(movieId);
      setFavorites((prev) => prev.filter((id) => id !== movieId));
      toast.success("Removed from favorites");
      return true;
    } catch {
      toast.error("Failed to remove from favorites");
      return false;
    }
  };

  const addToWatchlist = async (movieId) => {
    if (!user) {
      toast.error("Please login to add to watchlist");
      return false;
    }
    try {
      const response = await userAPI.addToWatchlist(movieId);
      setWatchlist(response.data.data);
      toast.success("Added to watchlist!");
      return true;
    } catch (_error) {
      const message =
        _error.response?.data?.message || "Failed to add to watchlist";
      toast.error(message);
      return false;
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await userAPI.removeFromWatchlist(movieId);
      setWatchlist((prev) =>
        prev.filter((item) => (item.movie?._id || item.movie) !== movieId),
      );
      toast.success("Removed from watchlist");
      return true;
    } catch {
      toast.error("Failed to remove from watchlist");
      return false;
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some((id) => id === movieId || id?._id === movieId);
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some(
      (item) => (item.movie?._id || item.movie) === movieId,
    );
  };

  const value = {
    user,
    loading,
    favorites,
    watchlist,
    login,
    signup,
    logout,
    addToFavorites,
    removeFromFavorites,
    addToWatchlist,
    removeFromWatchlist,
    isFavorite,
    isInWatchlist,
    refreshUser: checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
