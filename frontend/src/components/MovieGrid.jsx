import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import { Film } from 'lucide-react';

const MovieGrid = ({ movies, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="p-4 rounded-full bg-red-500/10 mb-4">
          <Film className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Movies</h3>
        <p className="text-dark-400">{error}</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="p-4 rounded-full bg-dark-800 mb-4">
          <Film className="w-12 h-12 text-dark-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Movies Found</h3>
        <p className="text-dark-400">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {movies.map((movie, index) => (
        <div 
          key={movie._id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;