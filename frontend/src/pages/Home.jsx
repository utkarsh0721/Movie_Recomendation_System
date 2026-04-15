import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  useTrendingMovies, 
  useTopRatedMovies, 
  useRecentMovies 
} from '../hooks/useMovies';
import { userAPI } from '../api';
import RecommendationCarousel from '../components/RecommendationCarousel';
import AISuggestions from '../components/AISuggestions';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  TrendingUp, 
  Star, 
  Clock, 
  Sparkles, 
  ArrowRight,
  Film
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { movies: trendingMovies, loading: trendingLoading } = useTrendingMovies(10);
  const { movies: topRatedMovies, loading: topRatedLoading } = useTopRatedMovies(10);
  const { movies: recentMovies, loading: recentLoading } = useRecentMovies(10);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setRecommendationsLoading(true);
      const response = await userAPI.getRecommendations(10);
      setRecommendations(response.data.data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-dark-900 to-dark-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full 
                          bg-gradient-to-r from-primary-500/20 to-accent-500/20 
                          border border-primary-500/30 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300 font-medium">
                Powered by Gemini AI
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              <span className="gradient-text">Discover Your Next</span>
              <br />
              <span className="text-white">Favorite Movie</span>
            </h1>

            <p className="text-xl text-dark-300 max-w-2xl mx-auto mb-8 animate-slide-up" 
               style={{ animationDelay: '0.1s' }}>
              AI-powered recommendations tailored just for you. 
              Explore thousands of movies and series from around the world.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
                 style={{ animationDelay: '0.2s' }}>
              <Link to="/explore" className="btn-primary px-8 py-3 text-lg">
                Explore Movies
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              {!user && (
                <Link to="/signup" className="btn-secondary px-8 py-3 text-lg">
                  Sign Up Free
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 animate-fade-in"
                 style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">10K+</div>
                <div className="text-sm text-dark-400 mt-1">Movies & Series</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">AI</div>
                <div className="text-sm text-dark-400 mt-1">Powered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">100%</div>
                <div className="text-sm text-dark-400 mt-1">Free</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* AI Suggestions (Only for logged-in users) */}
        {user && (
          <div className="mb-12 animate-fade-in">
            <AISuggestions />
          </div>
        )}

        {/* Personalized Recommendations (Only for logged-in users) */}
        {user && (
          <RecommendationCarousel
            title="Recommended For You"
            movies={recommendations}
            loading={recommendationsLoading}
            icon={Sparkles}
          />
        )}

        {/* Trending Movies */}
        <RecommendationCarousel
          title="Trending Now"
          movies={trendingMovies}
          loading={trendingLoading}
          icon={TrendingUp}
        />

        {/* Top Rated Movies */}
        <RecommendationCarousel
          title="Top Rated"
          movies={topRatedMovies}
          loading={topRatedLoading}
          icon={Star}
        />

        {/* Recently Added */}
        <RecommendationCarousel
          title="Recently Added"
          movies={recentMovies}
          loading={recentLoading}
          icon={Clock}
        />

        {/* CTA Section */}
        {!user && (
          <div className="mt-16 text-center bg-gradient-to-br from-primary-500/10 to-accent-500/10 
                        border border-primary-500/20 rounded-2xl p-12 animate-fade-in">
            <Film className="w-16 h-16 text-primary-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Get Personalized Recommendations
            </h2>
            <p className="text-dark-300 mb-6 max-w-xl mx-auto">
              Create an account to receive AI-powered movie recommendations 
              tailored to your taste and save your favorites.
            </p>
            <Link to="/signup" className="btn-primary px-8 py-3 text-lg">
              Sign Up Now
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;