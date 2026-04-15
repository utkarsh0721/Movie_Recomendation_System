import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMovieDetail } from "../hooks/useMovies";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import TrailerModal from "../components/TrailerModal";
import RecommendationCarousel from "../components/RecommendationCarousel";
import StarRating from "../components/StarRating";
import ReviewCard from "../components/ReviewCard";
import { toast } from "react-hot-toast";
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
import { reviewAPI } from "../api";
import { formatRating, getGenreColor, getMoodColor } from "../utils/helpers";

const MovieDetail = () => {
  const { id } = useParams();
  const { movie, similarMovies, loading, error, refetch } = useMovieDetail(id);
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
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);
  const [existingReviewId, setExistingReviewId] = useState(null);

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

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    setReviewLoading(true);
    setReviewError(null);

    try {
      const response = await reviewAPI.getByMovie(id);
      const reviewData = response.data.data || [];
      setReviews(reviewData);

      const userReview = reviewData.find(
        (item) => item.user?._id === user?._id,
      );
      if (userReview) {
        setReviewRating(userReview.rating);
        setReviewText(userReview.reviewText || "");
        setExistingReviewId(userReview._id);
      } else {
        setReviewRating(0);
        setReviewText("");
        setExistingReviewId(null);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setReviewLoading(false);
    }
  }, [id, user]);

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Please sign in to submit a review.");
      return;
    }

    if (!reviewRating) {
      toast.error("Please select a star rating.");
      return;
    }

    setSubmittingReview(true);

    try {
      await reviewAPI.addOrUpdate(id, reviewRating, reviewText.trim());
      toast.success("Your review has been saved.");
      await fetchReviews();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save review");
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

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

        {/* Review Summary and Write Review */}
        <div className="grid gap-8 mb-12 xl:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <div className="bg-dark-900 rounded-3xl border border-dark-800 p-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-dark-400 mb-2">
                    Rating Summary
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-5xl font-bold text-white leading-none">
                        {movie.averageRating > 0
                          ? movie.averageRating.toFixed(1)
                          : "0.0"}
                      </p>
                      <p className="text-sm text-dark-400">/5</p>
                    </div>
                    <div>
                      <StarRating
                        value={Math.round(movie.averageRating)}
                        readOnly
                      />
                      <p className="text-sm text-dark-400 mt-2">
                        {movie.totalReviews} review
                        {movie.totalReviews === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-dark-950 border border-dark-800 px-5 py-4 text-right">
                  <p className="text-dark-400 text-sm">
                    Average rating based on
                  </p>
                  <p className="text-white font-semibold">movie reviews</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-900 rounded-3xl border border-dark-800 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Write a review
                  </h3>
                  <p className="text-dark-400 text-sm">
                    Share your thoughts and rating for this movie.
                  </p>
                </div>
                <span className="text-sm text-dark-400">
                  {existingReviewId ? "Update review" : "New review"}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-dark-400 mb-2">Your rating</p>
                  <StarRating value={reviewRating} onChange={setReviewRating} />
                </div>

                <div>
                  <label className="sr-only" htmlFor="reviewText">
                    Review text
                  </label>
                  <textarea
                    id="reviewText"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={5}
                    placeholder="Tell others what you enjoyed or what could be better..."
                    className="w-full rounded-3xl border border-dark-800 bg-dark-950 px-4 py-4 text-sm text-dark-100 placeholder:text-dark-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                  className="btn-primary w-full px-6 py-3 text-sm font-semibold"
                >
                  {submittingReview
                    ? "Saving..."
                    : existingReviewId
                      ? "Update Review"
                      : "Submit Review"}
                </button>
              </div>

              {reviewError && (
                <p className="text-sm text-red-400 mt-3">{reviewError}</p>
              )}
            </div>
          </div>

          <div className="bg-dark-900 rounded-3xl border border-dark-800 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">All reviews</h3>
                <p className="text-dark-400 text-sm">
                  Read feedback from other viewers.
                </p>
              </div>
              <span className="text-sm text-dark-400">
                {reviewLoading
                  ? "Loading..."
                  : `${reviews.length} review${reviews.length === 1 ? "" : "s"}`}
              </span>
            </div>

            {reviewLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-dark-800 bg-dark-950 p-8 text-center text-dark-400">
                <p>No reviews yet. Be the first to rate this movie.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            )}
          </div>
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
