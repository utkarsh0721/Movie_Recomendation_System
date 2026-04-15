const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  genre: [{
    type: String,
    enum: ['Action', 'Thriller', 'Romance', 'Comedy', 'Partial Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Mystery', 'Fantasy', 'Adventure', 'Documentary', 'Animation']
  }],
  mood: [{
    type: String,
    enum: ['Fast-paced', 'Slow-paced', 'Emotional', 'Lighthearted', 'Dark', 'Feel-good', 'Suspenseful', 'Intense', 'Relaxing', 'Thought-provoking']
  }],
  contentType: {
    type: String,
    enum: ['Movie', 'Web Series', 'Anime', 'K-drama', 'Documentary', 'Mini Series'],
    required: true
  },
  ageRating: {
    type: String,
    enum: ['13+', '15+', '18+', 'All Ages'],
    default: '13+'
  },
  country: {
    type: String,
    enum: ['India', 'USA', 'Korea', 'Japan', 'UK', 'France', 'Spain', 'Germany', 'Others'],
    required: true
  },
  releaseYear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 5
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  userRatings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 10
    }
  }],
  poster: {
    type: String,
    required: true
  },
  backdrop: {
    type: String
  },
  trailer: {
    type: String
  },
  duration: {
    type: String
  },
  episodes: {
    type: Number
  },
  seasons: {
    type: Number
  },
  pace: {
    type: String,
    enum: ['Fast', 'Medium', 'Slow']
  },
  tags: [{
    type: String,
    trim: true
  }],
  cast: [{
    name: String,
    role: String,
    image: String
  }],
  director: {
    type: String
  },
  originalLanguage: {
    type: String
  },
  popularity: {
    type: Number,
    default: 0
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isTopRated: {
    type: Boolean,
    default: false
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better search performance
// movieSchema.index({ title: 'text', description: 'text', tags: 'text' });
movieSchema.index({ country: 1, releaseYear: 1 });
movieSchema.index({ rating: -1, popularity: -1 });

// Calculate average rating
movieSchema.methods.calculateAverageRating = function() {
  if (this.userRatings.length === 0) return 0;
  const sum = this.userRatings.reduce((acc, item) => acc + item.rating, 0);
  return Math.round((sum / this.userRatings.length) * 10) / 10;
};

// Pre-save middleware
// movieSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   if (this.userRatings.length > 0) {
//     this.rating = this.calculateAverageRating();
//   }
//   next();
// });

module.exports = mongoose.model('Movie', movieSchema);