import { useState, useEffect } from "react";
import { useMovies } from "../hooks/useMovies";
import { useDebounce } from "../hooks/useDebounce";
import { SORT_OPTIONS } from "../utils/constants";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import MovieGrid from "../components/MovieGrid";
import Pagination from "../components/Pagination";
import { SlidersHorizontal, X } from "lucide-react";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    movies,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    clearFilters,
    goToPage,
  } = useMovies({
    page: 1,
    limit: 20,
  });

  // Update search filter when debounced search changes
  useEffect(() => {
    updateFilters({ search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch, updateFilters]);

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchQuery("");
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split("-");
    updateFilters({ sortBy, sortOrder: sortOrder || "desc" });
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Explore Movies</h1>
          <p className="text-dark-400">
            Discover your next favorite from our collection
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search movies, series, anime..."
            />
          </div>

          <div className="flex gap-2">
            {/* Sort Dropdown */}
            <select
              onChange={handleSortChange}
              value={`${filters.sortBy || "popularity"}-${filters.sortOrder || "desc"}`}
              className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl 
                       text-white focus:outline-none focus:border-primary-500 
                       transition-all duration-300"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden btn-secondary px-4 py-3"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Filters Count */}
        {(Object.keys(filters).length > 2 || searchQuery) && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-dark-400">
              {pagination.total} results found
            </p>
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-2 text-sm text-primary-400 
                       hover:text-primary-300 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear all filters</span>
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>

          {/* Mobile Filter Modal */}
          {showMobileFilters && (
            <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
              <div className="h-full overflow-y-auto p-4">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClear={handleClearFilters}
                  isMobile={true}
                  onClose={() => setShowMobileFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Movies Grid */}
          <div className="flex-1">
            <MovieGrid movies={movies} loading={loading} error={error} />

            {/* Pagination */}
            {!loading && !error && movies.length > 0 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={goToPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
