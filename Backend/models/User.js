const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  watchlist: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    priority: {
      type: Number,
      default: 0
    }
  }],
  preferences: {
    favoriteGenres: [String],
    favoriteMoods: [String],
    preferredCountries: [String],
    preferredPace: [String]
  },
  searchHistory: [{
    query: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update preferences based on activity
userSchema.methods.updatePreferences = async function() {
  const Movie = mongoose.model('Movie');
  const favoriteMovies = await Movie.find({ _id: { $in: this.favorites } });
  
  const genreCount = {};
  const moodCount = {};
  const countryCount = {};
  const paceCount = {};
  
  favoriteMovies.forEach(movie => {
    movie.genre.forEach(g => genreCount[g] = (genreCount[g] || 0) + 1);
    movie.mood.forEach(m => moodCount[m] = (moodCount[m] || 0) + 1);
    if (movie.country) countryCount[movie.country] = (countryCount[movie.country] || 0) + 1;
    if (movie.pace) paceCount[movie.pace] = (paceCount[movie.pace] || 0) + 1;
  });
  
  const getTopItems = (obj, limit = 3) => 
    Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([key]) => key);
  
  this.preferences = {
    favoriteGenres: getTopItems(genreCount),
    favoriteMoods: getTopItems(moodCount),
    preferredCountries: getTopItems(countryCount),
    preferredPace: getTopItems(paceCount)
  };
  
  await this.save();
};

module.exports = mongoose.model('User', userSchema);