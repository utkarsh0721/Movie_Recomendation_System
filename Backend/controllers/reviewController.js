const Review = require('../models/Review');
const Movie = require('../models/Movie');

const calculateMovieRating = async (movieId) => {
  const ratingStats = await Review.aggregate([
    { $match: { movie: movieId } },
    {
      $group: {
        _id: '$movie',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (!ratingStats.length) {
    return {
      averageRating: 0,
      totalReviews: 0
    };
  }

  return {
    averageRating: Math.round(ratingStats[0].averageRating * 10) / 10,
    totalReviews: ratingStats[0].totalReviews
  };
};

exports.addOrUpdateReview = async (req, res) => {
  try {
    const { movieId, rating, reviewText } = req.body;

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }

    if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required and must be an integer between 1 and 5'
      });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    let review = await Review.findOne({ movie: movieId, user: req.user._id });

    if (review) {
      review.rating = rating;
      review.reviewText = reviewText || review.reviewText;
      review.updatedAt = new Date();
      await review.save();
    } else {
      review = await Review.create({
        movie: movieId,
        user: req.user._id,
        rating,
        reviewText
      });
    }

    const { averageRating, totalReviews } = await calculateMovieRating(movie._id);

    movie.averageRating = averageRating;
    movie.totalReviews = totalReviews;
    await movie.save();

    res.json({
      success: true,
      data: {
        review,
        movie: {
          averageRating: movie.averageRating,
          totalReviews: movie.totalReviews
        }
      }
    });
  } catch (error) {
    console.error('Add/update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saving review'
    });
  }
};

exports.getReviewsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const reviews = await Review.find({ movie: movieId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews'
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this review'
      });
    }

    await review.deleteOne();

    const { averageRating, totalReviews } = await calculateMovieRating(review.movie);
    await Movie.findByIdAndUpdate(review.movie, {
      averageRating,
      totalReviews
    });

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting review'
    });
  }
};
