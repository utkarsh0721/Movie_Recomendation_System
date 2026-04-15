import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Heart, Plus, Star, Play, Check } from "lucide-react";

const MovieCard = ({ movie, showActions = true }) => {
  const {
    isFavorite,
    isInWatchlist,
    addToFavorites,
    removeFromFavorites,
    addToWatchlist,
    removeFromWatchlist,
    user,
  } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const favorite = isFavorite(movie._id);
  const inWatchlist = isInWatchlist(movie._id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      await removeFromFavorites(movie._id);
    } else {
      await addToFavorites(movie._id);
    }
  };

  const handleWatchlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      await removeFromWatchlist(movie._id);
    } else {
      await addToWatchlist(movie._id);
    }
  };

  return (
    <Link
      to={`/movie/${movie._id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="card overflow-hidden transform transition-all duration-500 
                    group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary-500/10"
      >
        {/* Poster Container */}
        <div className="relative aspect-[2/3] overflow-hidden bg-dark-800">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-dark-700" />
          )}
          <img
            src={movie.poster}
            alt={movie.title}
            className={`w-full h-full object-cover transition-all duration-700
                      ${imageLoaded ? "opacity-100" : "opacity-0"}
                      ${isHovered ? "scale-110 blur-sm" : "scale-100"}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent
                        transition-all duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
          >
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`p-4 rounded-full bg-white/20 backdrop-blur-sm transform transition-all duration-500
                            ${isHovered ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
              >
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Rating Badge */}
            <div
              className="flex items-center space-x-1 px-2 py-1 rounded-lg 
                          bg-dark-900/80 backdrop-blur-sm"
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-white">
                {movie.rating?.toFixed(1) || "N/A"}
              </span>
            </div>

            {/* Content Type Badge */}
            <div className="px-2 py-1 rounded-lg bg-primary-500/80 backdrop-blur-sm">
              <span className="text-xs font-medium text-white">
                {movie.contentType}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && user && (
            <div
              className={`absolute bottom-3 right-3 flex flex-col space-y-2 transition-all duration-500
                          ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300
                          ${
                            favorite
                              ? "bg-red-500 text-white"
                              : "bg-dark-800/80 text-white hover:bg-red-500"
                          }`}
              >
                <Heart
                  className={`w-5 h-5 ${favorite ? "fill-current" : ""}`}
                />
              </button>
              <button
                onClick={handleWatchlistClick}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300
                          ${
                            inWatchlist
                              ? "bg-accent-500 text-white"
                              : "bg-dark-800/80 text-white hover:bg-accent-500"
                          }`}
              >
                {inWatchlist ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3
            className="font-semibold text-white truncate group-hover:text-primary-400 
                       transition-colors duration-300"
          >
            {movie.title}
          </h3>
          <div className="mt-1 flex items-center space-x-2 text-sm text-dark-400">
            <span>{movie.releaseYear}</span>
            <span>•</span>
            <span>{movie.country}</span>
          </div>

          {/* Genres */}
          <div className="mt-2 flex flex-wrap gap-1">
            {movie.genre?.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs rounded-full bg-dark-700 text-dark-300"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
