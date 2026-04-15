const User = require('../models/User');
const Movie = require('../models/Movie');
const recommendationService = require('../services/recommedationService');
const mongoose = require('mongoose');

// @desc    Add to favorites
// @route   POST /api/user/favorites/:movieId
// @access  Private
exports.addToFavorites = async (req, res) => {
  try {
    const { movieId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid movie id'
      });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    // Check if already in favorites
    if (user.favorites.some((id) => id.toString() === movieId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Movie already in favorites' 
      });
    }

    user.favorites.push(movieId);
    await user.save();

    res.json({
      success: true,
      message: 'Added to favorites',
      data: user.favorites
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/user/favorites/:movieId
// @access  Private
exports.removeFromFavorites = async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(
      id => id.toString() !== movieId
    );
    await user.save();

    res.json({
      success: true,
      message: 'Removed from favorites',
      data: user.favorites
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get favorites
// @route   GET /api/user/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');

    res.json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Add to watchlist
// @route   POST /api/user/watchlist/:movieId
// @access  Private
exports.addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { priority = 0 } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid movie id'
      });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    // Check if already in watchlist
    const existingItem = user.watchlist.find(
      item => item.movie.toString() === movieId
    );

    if (existingItem) {
      return res.status(400).json({ 
        success: false, 
        message: 'Movie already in watchlist' 
      });
    }

    user.watchlist.push({
      movie: movieId,
      priority,
      addedAt: Date.now()
    });
    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .populate('watchlist.movie');

    res.json({
      success: true,
      message: 'Added to watchlist',
      data: updatedUser.watchlist
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Add multiple movies to watchlist
// @route   POST /api/user/watchlist/bulk
// @access  Private
exports.addBulkToWatchlist = async (req, res) => {
  try {
    const { movieIds } = req.body;
    const user = await User.findById(req.user._id);

    const existingMovieIds = user.watchlist.map(item => item.movie.toString());
    const newMovieIds = movieIds.filter(id => !existingMovieIds.includes(id));

    // Verify all movies exist
    const movies = await Movie.find({ _id: { $in: newMovieIds } });
    const validMovieIds = movies.map(m => m._id.toString());

    const newItems = validMovieIds.map((movieId, index) => ({
      movie: movieId,
      priority: index,
      addedAt: Date.now()
    }));

    user.watchlist.push(...newItems);
    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .populate('watchlist.movie');

    res.json({
      success: true,
      message: `Added ${newItems.length} movies to watchlist`,
      data: updatedUser.watchlist
    });
  } catch (error) {
    console.error('Add bulk to watchlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Remove from watchlist
// @route   DELETE /api/user/watchlist/:movieId
// @access  Private
exports.removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user._id);

    user.watchlist = user.watchlist.filter(
      item => item.movie.toString() !== movieId
    );
    await user.save();

    res.json({
      success: true,
      message: 'Removed from watchlist',
      data: user.watchlist
    });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get watchlist
// @route   GET /api/user/watchlist
// @access  Private
exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watchlist.movie');

    res.json({
      success: true,
      data: user.watchlist
    });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get smart sorted watchlist
// @route   GET /api/user/watchlist/smart-sort
// @access  Private
exports.getSmartSortedWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('watchlist.movie');

    const sortedWatchlist = await recommendationService.sortWatchlistSmart(
      user.watchlist
    );

    res.json({
      success: true,
      data: sortedWatchlist
    });
  } catch (error) {
    console.error('Get smart sorted watchlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get personalized recommendations
// @route   GET /api/user/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const user = await User.findById(req.user._id);

    const recommendations = await recommendationService.getPersonalizedRecommendations(
      user,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get watchlist-based recommendations
// @route   GET /api/user/watchlist/recommendations
// @access  Private
exports.getWatchlistRecommendations = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const user = await User.findById(req.user._id);

    const watchlistMovieIds = user.watchlist.map(item => item.movie);
    const recommendations = await recommendationService.getWatchlistBasedRecommendations(
      watchlistMovieIds,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Get watchlist recommendations error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Add search to history
// @route   POST /api/user/search-history
// @access  Private
exports.addSearchHistory = async (req, res) => {
  try {
    const { query } = req.body;
    const user = await User.findById(req.user._id);

    user.searchHistory.unshift({
      query,
      timestamp: Date.now()
    });

    // Keep only last 50 searches
    if (user.searchHistory.length > 50) {
      user.searchHistory = user.searchHistory.slice(0, 50);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Search history updated'
    });
  } catch (error) {
    console.error('Add search history error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/user/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findById(req.user._id);

    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    res.json({
      success: true,
      data: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};