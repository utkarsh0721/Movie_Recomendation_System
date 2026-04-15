const aiService = require('../services/aiService');
const Movie = require('../models/Movie');

// @desc    Generate tags for new movie
// @route   POST /api/ai/generate-tags
// @access  Private
exports.generateTags = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const result = await aiService.generateMovieTags({ title, description });

    res.json({
      success: true,
      data: result.data,
      aiGenerated: result.aiGenerated,
      provider: result.provider
    });
  } catch (error) {
    console.error('Generate tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating tags'
    });
  }
};

// @desc    Bulk generate tags for movies
// @route   POST /api/ai/bulk-generate-tags
// @access  Private (Admin)
exports.bulkGenerateTags = async (req, res) => {
  try {
    const { limit = 10 } = req.body;
    
    const movies = await Movie.find({
      $or: [
        { genre: { $size: 0 } },
        { mood: { $size: 0 } },
        { genre: { $exists: false } },
        { mood: { $exists: false } }
      ]
    }).limit(limit);

    if (movies.length === 0) {
      return res.json({
        success: true,
        message: 'No movies need tag generation',
        data: []
      });
    }

    console.log(`Starting bulk tag generation for ${movies.length} movies...`);

    const results = await aiService.batchGenerateTags(movies, (current, total) => {
      console.log(`Progress: ${current}/${total}`);
    });

    // Update movies with generated tags
    let updatedCount = 0;
    for (const result of results) {
      if (result.success && result.tags.success) {
        const movie = await Movie.findById(result.movieId);
        if (movie) {
          movie.genre = movie.genre?.length > 0 ? movie.genre : result.tags.data.genre;
          movie.mood = movie.mood?.length > 0 ? movie.mood : result.tags.data.mood;
          movie.ageRating = movie.ageRating || result.tags.data.ageRating;
          movie.pace = movie.pace || result.tags.data.pace;
          movie.tags = [...new Set([...(movie.tags || []), ...result.tags.data.tags])];
          movie.aiGenerated = result.tags.aiGenerated;

          await movie.save();
          updatedCount++;
        }
      }
    }

    res.json({
      success: true,
      message: `Updated ${updatedCount} out of ${movies.length} movies`,
      data: results.map(r => ({
        title: r.title,
        success: r.success,
        provider: r.tags.provider
      }))
    });
  } catch (error) {
    console.error('Bulk generate tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bulk generation'
    });
  }
};

// @desc    Get personalized suggestions using AI
// @route   GET /api/ai/suggestions
// @access  Private
exports.getPersonalizedSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const User = require('../models/User');
    
    const user = await User.findById(userId).populate('favorites');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const result = await aiService.generatePersonalizedSuggestions(
      user.preferences,
      user.favorites || []
    );

    res.json({
      success: result.success,
      data: result.data,
      message: result.message
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting suggestions'
    });
  }
};

// @desc    Analyze movie description
// @route   POST /api/ai/analyze
// @access  Public
exports.analyzeMovie = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const result = await aiService.analyzeMovieDescription(title, description);

    res.json({
      success: result.success,
      data: result.data,
      message: result.message
    });
  } catch (error) {
    console.error('Analyze movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error analyzing movie'
    });
  }
};