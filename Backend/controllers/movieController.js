const Movie = require('../models/Movie');
const aiService = require('../services/aiService');
const recommendationService = require('../services/recommedationService');

// @desc    Get all movies with filters
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      genre,
      mood,
      contentType,
      ageRating,
      country,
      yearFrom,
      yearTo,
      minRating,
      pace,
      search,
      sortBy = 'popularity',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    if (genre) {
      const genres = genre.split(',');
      query.genre = { $in: genres };
    }

    if (mood) {
      const moods = mood.split(',');
      query.mood = { $in: moods };
    }

    if (contentType) {
      const types = contentType.split(',');
      query.contentType = { $in: types };
    }

    if (ageRating) {
      const ratings = ageRating.split(',');
      query.ageRating = { $in: ratings };
    }

    if (country) {
      const countries = country.split(',');
      query.country = { $in: countries };
    }

    if (yearFrom || yearTo) {
      query.releaseYear = {};
      if (yearFrom) query.releaseYear.$gte = parseInt(yearFrom);
      if (yearTo) query.releaseYear.$lte = parseInt(yearTo);
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (pace) {
      const paces = pace.split(',');
      query.pace = { $in: paces };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [movies, total] = await Promise.all([
      Movie.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Movie.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: movies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching movies' 
    });
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    // Increment popularity
    movie.popularity += 1;
    await movie.save();

    // Get similar movies
    const similarMovies = await recommendationService.getSimilarMovies(movie._id);

    res.json({
      success: true,
      data: {
        ...movie.toObject(),
        similarMovies
      }
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching movie' 
    });
  }
};

// @desc    Create movie
// @route   POST /api/movies
// @access  Private (Admin)
exports.createMovie = async (req, res) => {
  try {
    const movieData = req.body;

    // Auto-generate tags if not provided
    if (!movieData.genre || movieData.genre.length === 0 || 
        !movieData.mood || movieData.mood.length === 0) {
      const aiTags = await aiService.generateMovieTags({
        title: movieData.title,
        description: movieData.description
      });

      if (aiTags.success) {
        movieData.genre = movieData.genre?.length > 0 ? movieData.genre : aiTags.data.genre;
        movieData.mood = movieData.mood?.length > 0 ? movieData.mood : aiTags.data.mood;
        movieData.ageRating = movieData.ageRating || aiTags.data.ageRating;
        movieData.pace = movieData.pace || aiTags.data.pace;
        movieData.tags = [...new Set([...(movieData.tags || []), ...aiTags.data.tags])];
        movieData.aiGenerated = aiTags.aiGenerated;
      }
    }

    const movie = await Movie.create(movieData);

    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error creating movie' 
    });
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private (Admin)
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating movie' 
    });
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private (Admin)
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error deleting movie' 
    });
  }
};

// @desc    Rate movie
// @route   POST /api/movies/:id/rate
// @access  Private
exports.rateMovie = async (req, res) => {
  try {
    const { rating } = req.body;
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    // Check if user already rated
    const existingRating = movie.userRatings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      movie.userRatings.push({
        user: req.user._id,
        rating
      });
    }

    await movie.save();

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Rate movie error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error rating movie' 
    });
  }
};

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
exports.getTrending = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const movies = await recommendationService.getTrendingMovies(parseInt(limit));

    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get top rated movies
// @route   GET /api/movies/top-rated
// @access  Public
exports.getTopRated = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const movies = await recommendationService.getTopRatedMovies(parseInt(limit));

    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    console.error('Get top rated error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get recently added
// @route   GET /api/movies/recent
// @access  Public
exports.getRecent = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const movies = await recommendationService.getRecentlyAdded(parseInt(limit));

    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    console.error('Get recent error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Auto-generate tags for movie
// @route   POST /api/movies/:id/generate-tags
// @access  Private (Admin)
exports.generateTags = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movie not found' 
      });
    }

    const aiTags = await aiService.generateMovieTags({
      title: movie.title,
      description: movie.description
    });

    if (aiTags.success) {
      movie.genre = aiTags.data.genre;
      movie.mood = aiTags.data.mood;
      movie.ageRating = aiTags.data.ageRating;
      movie.pace = aiTags.data.pace;
      movie.tags = [...new Set([...movie.tags, ...aiTags.data.tags])];
      movie.aiGenerated = aiTags.aiGenerated;
      
      await movie.save();
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Generate tags error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error generating tags' 
    });
  }
};