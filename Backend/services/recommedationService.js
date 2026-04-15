const Movie = require('../models/Movie');

class RecommendationService {
  // Get recommendations based on user preferences
  async getPersonalizedRecommendations(user, limit = 20) {
    const { preferences, favorites, watchlist } = user;
    
    // Get IDs to exclude (already in favorites or watchlist)
    const excludeIds = [
      ...favorites,
      ...watchlist.map(w => w.movie)
    ];

    // Build query based on preferences
    const query = {
      _id: { $nin: excludeIds }
    };

    if (preferences?.favoriteGenres?.length > 0) {
      query.genre = { $in: preferences.favoriteGenres };
    }

    if (preferences?.favoriteMoods?.length > 0) {
      query.mood = { $in: preferences.favoriteMoods };
    }

    if (preferences?.preferredCountries?.length > 0) {
      query.country = { $in: preferences.preferredCountries };
    }

    const recommendations = await Movie.find(query)
      .sort({ rating: -1, popularity: -1 })
      .limit(limit);

    // If not enough recommendations, add popular movies
    if (recommendations.length < limit) {
      const additionalMovies = await Movie.find({
        _id: { $nin: [...excludeIds, ...recommendations.map(r => r._id)] }
      })
        .sort({ popularity: -1, rating: -1 })
        .limit(limit - recommendations.length);
      
      recommendations.push(...additionalMovies);
    }

    return recommendations;
  }

  // Get similar movies based on a specific movie
  async getSimilarMovies(movieId, limit = 10) {
    const movie = await Movie.findById(movieId);
    if (!movie) return [];

    const query = {
      _id: { $ne: movieId },
      $or: [
        { genre: { $in: movie.genre } },
        { mood: { $in: movie.mood } },
        { country: movie.country },
        { contentType: movie.contentType }
      ]
    };

    const similarMovies = await Movie.aggregate([
      { $match: query },
      {
        $addFields: {
          similarityScore: {
            $add: [
              { $multiply: [{ $size: { $setIntersection: ['$genre', movie.genre] } }, 3] },
              { $multiply: [{ $size: { $setIntersection: ['$mood', movie.mood] } }, 2] },
              { $cond: [{ $eq: ['$country', movie.country] }, 2, 0] },
              { $cond: [{ $eq: ['$contentType', movie.contentType] }, 1, 0] }
            ]
          }
        }
      },
      { $sort: { similarityScore: -1, rating: -1 } },
      { $limit: limit }
    ]);

    return similarMovies;
  }

  // Get recommendations based on watchlist
  async getWatchlistBasedRecommendations(watchlistMovieIds, limit = 10) {
    const watchlistMovies = await Movie.find({ _id: { $in: watchlistMovieIds } });
    
    if (watchlistMovies.length === 0) return [];

    // Aggregate genres and moods from watchlist
    const genreCount = {};
    const moodCount = {};
    const countryCount = {};

    watchlistMovies.forEach(movie => {
      movie.genre.forEach(g => genreCount[g] = (genreCount[g] || 0) + 1);
      movie.mood.forEach(m => moodCount[m] = (moodCount[m] || 0) + 1);
      if (movie.country) countryCount[movie.country] = (countryCount[movie.country] || 0) + 1;
    });

    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    const topMoods = Object.entries(moodCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([mood]) => mood);

    const recommendations = await Movie.find({
      _id: { $nin: watchlistMovieIds },
      $or: [
        { genre: { $in: topGenres } },
        { mood: { $in: topMoods } }
      ]
    })
      .sort({ rating: -1 })
      .limit(limit);

    return recommendations;
  }

  // Smart sort watchlist using AI logic
  async sortWatchlistSmart(watchlistMovies) {
    // Sort by multiple factors
    const sortedMovies = watchlistMovies.sort((a, b) => {
      // Priority 1: Rating
      const ratingDiff = (b.movie?.rating || 0) - (a.movie?.rating || 0);
      if (Math.abs(ratingDiff) > 1) return ratingDiff;

      // Priority 2: Trending
      if (b.movie?.isTrending && !a.movie?.isTrending) return 1;
      if (a.movie?.isTrending && !b.movie?.isTrending) return -1;

      // Priority 3: Popularity
      const popDiff = (b.movie?.popularity || 0) - (a.movie?.popularity || 0);
      if (Math.abs(popDiff) > 100) return popDiff;

      // Priority 4: Recently added
      return new Date(b.addedAt) - new Date(a.addedAt);
    });

    return sortedMovies;
  }

  // Get trending movies
  async getTrendingMovies(limit = 10) {
    return Movie.find({ isTrending: true })
      .sort({ popularity: -1, rating: -1 })
      .limit(limit);
  }

  // Get top rated movies
  async getTopRatedMovies(limit = 10) {
    return Movie.find({ rating: { $gte: 7 } })
      .sort({ rating: -1 })
      .limit(limit);
  }

  // Get recently added movies
  async getRecentlyAdded(limit = 10) {
    return Movie.find()
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

module.exports = new RecommendationService();