const express = require('express');
const router = express.Router();
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  rateMovie,
  getTrending,
  getTopRated,
  getRecent,
  generateTags
} = require('../controllers/movieController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', getMovies);
router.get('/trending', getTrending);
router.get('/top-rated', getTopRated);
router.get('/recent', getRecent);
router.get('/:id', optionalAuth, getMovie);

// Protected routes
router.post('/', protect, createMovie);
router.put('/:id', protect, updateMovie);
router.delete('/:id', protect, deleteMovie);
router.post('/:id/rate', protect, rateMovie);
router.post('/:id/generate-tags', protect, generateTags);

module.exports = router;