const express = require('express');
const router = express.Router();
const {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  addToWatchlist,
  addBulkToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  getSmartSortedWatchlist,
  getRecommendations,
  getWatchlistRecommendations,
  addSearchHistory,
  updatePreferences
} = require('../controllers/userController');
const { 
  generateTags, 
  bulkGenerateTags, 
  getPersonalizedSuggestions,
  analyzeMovie 
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Favorites
router.get('/favorites', getFavorites);
router.post('/favorites/:movieId', addToFavorites);
router.delete('/favorites/:movieId', removeFromFavorites);

// Watchlist
router.post('/watchlist/bulk', addBulkToWatchlist);
router.get('/watchlist/smart-sort', getSmartSortedWatchlist);
router.get('/watchlist/recommendations', getWatchlistRecommendations);
router.get('/watchlist', getWatchlist);
router.post('/watchlist/:movieId', addToWatchlist);
router.delete('/watchlist/:movieId', removeFromWatchlist);

// Recommendations
router.get('/recommendations', getRecommendations);

// Search history
router.post('/search-history', addSearchHistory);

// Preferences
router.put('/preferences', updatePreferences);

// AI Features
router.post('/ai/generate-tags', generateTags);
router.post('/ai/bulk-generate-tags', bulkGenerateTags);
router.get('/ai/suggestions', getPersonalizedSuggestions);
router.post('/ai/analyze', analyzeMovie);

module.exports = router;