import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import MovieCard from "./MovieCard";
import LoadingSpinner from "./LoadingSpinner";

const RecommendationCarousel = ({ title, movies, loading, icon }) => {
  const Icon = icon ?? Sparkles;
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkArrows();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkArrows);
      window.addEventListener("resize", checkArrows);
      return () => {
        scrollElement.removeEventListener("scroll", checkArrows);
        window.removeEventListener("resize", checkArrows);
      };
    }
  }, [movies]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <Icon className="w-6 h-6 text-primary-400 animate-pulse" />
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="mb-12 group/carousel">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div
            className="p-2 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 
                        border border-primary-500/30"
          >
            <Icon className="w-5 h-5 text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <span className="px-3 py-1 rounded-full bg-dark-800 text-dark-300 text-sm">
            {movies.length} {movies.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
                     bg-dark-900/90 backdrop-blur-sm border border-dark-700
                     text-white hover:bg-dark-800 hover:border-primary-500 
                     transition-all duration-300 transform hover:scale-110
                     opacity-0 group-hover/carousel:opacity-100 -translate-x-4 
                     group-hover/carousel:translate-x-0 shadow-xl"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
                     bg-dark-900/90 backdrop-blur-sm border border-dark-700
                     text-white hover:bg-dark-800 hover:border-primary-500 
                     transition-all duration-300 transform hover:scale-110
                     opacity-0 group-hover/carousel:opacity-100 translate-x-4 
                     group-hover/carousel:translate-x-0 shadow-xl"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Movies Grid */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie._id || index}
              className="flex-none w-[280px] sm:w-[220px] md:w-[240px] lg:w-[260px]
                       animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="mt-4 flex justify-center space-x-2">
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              showLeftArrow ? "w-2 bg-dark-600" : "w-0"
            }`}
          />
          <div className="h-1 w-8 rounded-full bg-primary-500" />
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              showRightArrow ? "w-2 bg-dark-600" : "w-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default RecommendationCarousel;
