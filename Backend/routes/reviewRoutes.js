const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addOrUpdateReview,
  getReviewsByMovie,
  deleteReview
} = require('../controllers/reviewController');

router.post('/', protect, addOrUpdateReview);
router.get('/:movieId', getReviewsByMovie);
router.delete('/:id', protect, deleteReview);

module.exports = router;
