import { useEffect, useState } from "react";
import { userAPI } from "../api";
import MovieGrid from "../components/MovieGrid";
import { Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getFavorites();
      setFavorites(response.data.data);
    } catch {
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to remove all favorites?")) {
      return;
    }

    try {
      await Promise.all(
        favorites.map((movie) => userAPI.removeFromFavorites(movie._id)),
      );
      setFavorites([]);
      toast.success("All favorites cleared");
    } catch {
      toast.error("Failed to clear favorites");
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">My Favorites</h1>
              <p className="text-dark-400 mt-1">
                {favorites.length} {favorites.length === 1 ? "movie" : "movies"}{" "}
                saved
              </p>
            </div>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl
                       bg-dark-800 text-red-400 border border-dark-700
                       hover:bg-red-500/10 hover:border-red-500/30 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Movies Grid */}
        <MovieGrid movies={favorites} loading={loading} error={error} />

        {!loading && !error && favorites.length === 0 && (
          <div className="text-center py-20">
            <div className="p-4 rounded-full bg-dark-800 inline-block mb-4">
              <Heart className="w-12 h-12 text-dark-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Favorites Yet
            </h3>
            <p className="text-dark-400 max-w-md mx-auto">
              Start adding movies to your favorites by clicking the heart icon
              on any movie card
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
