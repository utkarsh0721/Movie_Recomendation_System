import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovies";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import TrailerModal from "../components/TrailerModal";
import RecommendationCarousel from "../components/RecommendationCarousel";
import {
  Heart,
  Plus,
  Star,
  Calendar,
  Clock,
  Globe,
  Film,
  Play,
  Check,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { formatRating, getGenreColor, getMoodColor } from "../utils/helpers";

const MovieDetail = () => {
  const { id } = useParams();
  const { movie, similarMovies, loading, error } = useMovieDetail(id);
  const {
    user,
    isFavorite,
    isInWatchlist,
    addToFavorites,
    removeFromFavorites,
    addToWatchlist,
    removeFromWatchlist,
  } = useAuth();
  const [showTrailer, setShowTrailer] = useState(false);

  const favorite = isFavorite(id);
  const inWatchlist = isInWatchlist(id);

  const handleFavoriteClick = async () => {
    if (favorite) {
      await removeFromFavorites(id);
    } else {
      await addToFavorites(id);
    }
  };

  const handleWatchlistClick = async () => {
    if (inWatchlist) {
      await removeFromWatchlist(id);
    } else {
      await addToWatchlist(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading movie details..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Film className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Movie Not Found
          </h2>
          <p className="text-dark-400 mb-6">
            {error || "This movie does not exist"}
          </p>
          <Link to="/explore" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh] md:h-[80vh]">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-transparent to-dark-950/50" />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <Link
            to="/explore"
            className="inline-flex items-center space-x-2 text-dark-300 hover:text-white 
                     transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Explore</span>
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-end h-full">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-48 md:w-64 rounded-2xl shadow-2xl border-4 border-dark-800"
              />
            </div>

            {/* Info */}
            <div className="flex-1 pb-4">
              <div className="flex items-center space-x-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-primary-500 text-white text-sm font-medium">
                  {movie.contentType}
                </span>
                {movie.isTrending && (
                  <span className="px-3 py-1 rounded-full bg-accent-500 text-white text-sm font-medium flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Trending
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-dark-300 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xl font-bold text-white">
                    {formatRating(movie.rating)}
                  </span>
                  <span className="text-dark-500">/10</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{movie.releaseYear}</span>
                </div>
                {movie.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{movie.duration}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>{movie.country}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {movie.trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="btn-primary px-6 py-3"
                  >
                    <Play className="w-5 h-5 mr-2 inline" />
                    Watch Trailer
                  </button>
                )}

                {user && (
                  <>
                    <button
                      onClick={handleFavoriteClick}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300
                                ${
                                  favorite
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-dark-800 text-white border border-dark-700 hover:bg-dark-700"
                                }`}
                    >
                      <Heart
                        className={`w-5 h-5 mr-2 inline ${favorite ? "fill-current" : ""}`}
                      />
                      {favorite ? "Remove from Favorites" : "Add to Favorites"}
                    </button>

                    <button
                      onClick={handleWatchlistClick}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300
                                ${
                                  inWatchlist
                                    ? "bg-accent-500 text-white hover:bg-accent-600"
                                    : "bg-dark-800 text-white border border-dark-700 hover:bg-dark-700"
                                }`}
                    >
                      {inWatchlist ? (
                        <>
                          <Check className="w-5 h-5 mr-2 inline" />
                          In Watchlist
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-2 inline" />
                          Add to Watchlist
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Description */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
          <p className="text-lg text-dark-300 leading-relaxed">
            {movie.description}
          </p>
        </div>

        {/* Genres & Moods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {movie.genre?.map((genre, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 rounded-xl border ${getGenreColor(genre)}`}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Mood</h3>
            <div className="flex flex-wrap gap-2">
              {movie.mood?.map((mood, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 rounded-xl ${getMoodColor(mood)}`}
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="card p-4">
            <p className="text-dark-400 text-sm mb-1">Age Rating</p>
            <p className="text-white font-semibold text-lg">
              {movie.ageRating}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-dark-400 text-sm mb-1">Pace</p>
            <p className="text-white font-semibold text-lg">{movie.pace}</p>
          </div>
          {movie.originalLanguage && (
            <div className="card p-4">
              <p className="text-dark-400 text-sm mb-1">Language</p>
              <p className="text-white font-semibold text-lg">
                {movie.originalLanguage}
              </p>
            </div>
          )}
          {movie.director && (
            <div className="card p-4">
              <p className="text-dark-400 text-sm mb-1">Director</p>
              <p className="text-white font-semibold text-lg">
                {movie.director}
              </p>
            </div>
          )}
        </div>

        {/* Tags */}
        {movie.tags && movie.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {movie.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg bg-dark-800 text-dark-300 text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similarMovies && similarMovies.length > 0 && (
          <RecommendationCarousel
            title="Similar Movies You Might Like"
            movies={similarMovies}
            loading={false}
          />
        )}
      </div>

      {/* Trailer Modal */}
      {movie.trailer && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          trailerUrl={movie.trailer}
          title={movie.title}
        />
      )}
    </div>
  );
};

export default MovieDetail;
