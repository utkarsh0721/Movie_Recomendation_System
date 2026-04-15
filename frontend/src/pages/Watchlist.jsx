import { useEffect, useState } from "react";
import { userAPI } from "../api";
import MovieGrid from "../components/MovieGrid";
import LoadingSpinner from "../components/LoadingSpinner";
import { List, Sparkles, Trash2, ArrowUpDown } from "lucide-react";
import toast from "react-hot-toast";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [smartSorting, setSmartSorting] = useState(false);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getWatchlist();
      setWatchlist(response.data.data);
    } catch {
      setError("Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  };

  const handleSmartSort = async () => {
    try {
      setSmartSorting(true);
      const response = await userAPI.getSmartSortedWatchlist();
      setWatchlist(response.data.data);
      toast.success("Watchlist sorted by AI!");
    } catch {
      toast.error("Failed to sort watchlist");
    } finally {
      setSmartSorting(false);
    }
  };

  const handleClearAll = async () => {
    if (
      !window.confirm("Are you sure you want to clear your entire watchlist?")
    ) {
      return;
    }

    try {
      await Promise.all(
        watchlist.map((item) =>
          userAPI.removeFromWatchlist(item.movie._id || item.movie),
        ),
      );
      setWatchlist([]);
      toast.success("Watchlist cleared");
    } catch {
      toast.error("Failed to clear watchlist");
    }
  };

  const watchlistMovies = watchlist.map((item) => item.movie).filter(Boolean);

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-accent-500/20 border border-accent-500/30">
              <List className="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">My Watchlist</h1>
              <p className="text-dark-400 mt-1">
                {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"}{" "}
                to watch
              </p>
            </div>
          </div>

          {watchlist.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSmartSort}
                disabled={smartSorting}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl
                         bg-gradient-to-r from-primary-500 to-accent-500
                         text-white hover:from-primary-600 hover:to-accent-600
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {smartSorting ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Sorting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>AI Sort</span>
                  </>
                )}
              </button>

              <button
                onClick={handleClearAll}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl
                         bg-dark-800 text-red-400 border border-dark-700
                         hover:bg-red-500/10 hover:border-red-500/30 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* AI Sort Info */}
        {watchlist.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-primary-400 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">
                  AI Smart Sorting
                </h3>
                <p className="text-sm text-dark-300">
                  Click "AI Sort" to automatically organize your watchlist based
                  on ratings, trending status, and popularity for the best
                  viewing experience.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        <MovieGrid movies={watchlistMovies} loading={loading} error={error} />

        {!loading && !error && watchlist.length === 0 && (
          <div className="text-center py-20">
            <div className="p-4 rounded-full bg-dark-800 inline-block mb-4">
              <List className="w-12 h-12 text-dark-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Your Watchlist is Empty
            </h3>
            <p className="text-dark-400 max-w-md mx-auto">
              Add movies you want to watch later by clicking the plus icon on
              any movie card
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
