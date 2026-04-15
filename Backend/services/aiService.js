const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    // Only enable Gemini when BOTH key and model are explicitly configured.
    // This prevents noisy 404s when the default model name doesn't match the API version/key access.
    if (
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
      process.env.GEMINI_MODEL
    ) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.modelName = process.env.GEMINI_MODEL;
      this.model = this.genAI.getGenerativeModel({ model: this.modelName });
      this.useGemini = true;
      console.log(`✅ Gemini AI initialized successfully (${this.modelName})`);
    } else {
      this.useGemini = false;
      console.log('⚠️ Gemini API key not configured. Using local AI logic.');
    }
  }

  // Auto-generate tags for a movie
  async generateMovieTags(movieData) {
    if (this.useGemini) {
      return this.generateTagsWithGemini(movieData);
    }
    return this.generateTagsLocally(movieData);
  }

  async generateTagsWithGemini(movieData) {
    try {
      const prompt = `Analyze this movie/show and generate appropriate tags in JSON format.

Title: ${movieData.title}
Description: ${movieData.description}

Generate the following fields:
- genre (array): Choose 2-3 from [Action, Thriller, Romance, Comedy, Partial Comedy, Drama, Horror, Sci-Fi, Mystery, Fantasy, Adventure, Documentary, Animation]
- mood (array): Choose 2-3 from [Fast-paced, Slow-paced, Emotional, Lighthearted, Dark, Feel-good, Suspenseful, Intense, Relaxing, Thought-provoking]
- ageRating (string): Choose one from [13+, 15+, 18+, All Ages]
- pace (string): Choose one from [Fast, Medium, Slow]
- tags (array): Generate 5-8 relevant descriptive tags

Return ONLY valid JSON without markdown formatting or code blocks. Example format:
{
  "genre": ["Drama", "Thriller"],
  "mood": ["Dark", "Intense"],
  "ageRating": "18+",
  "pace": "Fast",
  "tags": ["crime", "suspense", "mystery", "gripping", "psychological"]
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response text - remove markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/g, '');
      }
      
      const result_data = JSON.parse(cleanText);
      
      return {
        success: true,
        data: result_data,
        aiGenerated: true,
        provider: 'gemini'
      };
    } catch (error) {
      const message = error?.message || String(error);
      console.error('Gemini AI error:', message);

      if (message.includes('404') || message.toLowerCase().includes('not found')) {
        this.useGemini = false;
      }

      console.log('Falling back to local AI logic...');
      return this.generateTagsLocally(movieData);
    }
  }

  generateTagsLocally(movieData) {
    const { title, description } = movieData;
    const text = `${title} ${description}`.toLowerCase();

    // Genre detection with improved keywords
    const genreKeywords = {
      'Action': ['action', 'fight', 'battle', 'war', 'explosive', 'combat', 'martial arts', 'chase', 'gunfight'],
      'Thriller': ['thriller', 'suspense', 'mystery', 'tense', 'twist', 'psychological', 'danger', 'chase'],
      'Romance': ['love', 'romance', 'romantic', 'relationship', 'heart', 'passion', 'dating', 'couple'],
      'Comedy': ['comedy', 'funny', 'humor', 'laugh', 'hilarious', 'comic', 'witty', 'jokes'],
      'Drama': ['drama', 'emotional', 'family', 'life', 'struggle', 'journey', 'story', 'character'],
      'Horror': ['horror', 'scary', 'terrifying', 'ghost', 'haunted', 'fear', 'nightmare', 'evil'],
      'Sci-Fi': ['sci-fi', 'science fiction', 'space', 'future', 'technology', 'alien', 'robot', 'time travel'],
      'Mystery': ['mystery', 'detective', 'crime', 'investigation', 'clue', 'solve', 'whodunit'],
      'Fantasy': ['fantasy', 'magic', 'wizard', 'dragon', 'mythical', 'supernatural', 'enchanted', 'realm'],
      'Adventure': ['adventure', 'journey', 'quest', 'explore', 'discovery', 'expedition', 'voyage'],
      'Animation': ['animated', 'animation', 'cartoon', 'anime'],
      'Documentary': ['documentary', 'real story', 'true story', 'based on']
    };

    const moodKeywords = {
      'Fast-paced': ['fast', 'action', 'intense', 'thrilling', 'exciting', 'rapid', 'quick'],
      'Slow-paced': ['slow', 'thoughtful', 'contemplative', 'peaceful', 'meditative', 'deliberate'],
      'Emotional': ['emotional', 'touching', 'moving', 'heartfelt', 'sad', 'tears', 'powerful'],
      'Lighthearted': ['light', 'fun', 'cheerful', 'happy', 'playful', 'carefree', 'breezy'],
      'Dark': ['dark', 'grim', 'noir', 'bleak', 'twisted', 'sinister', 'shadowy'],
      'Feel-good': ['feel-good', 'uplifting', 'inspiring', 'warm', 'heartwarming', 'positive'],
      'Suspenseful': ['suspense', 'tense', 'edge', 'gripping', 'nail-biting', 'tension'],
      'Intense': ['intense', 'powerful', 'gripping', 'riveting', 'forceful', 'strong'],
      'Thought-provoking': ['thought-provoking', 'philosophical', 'deep', 'meaningful', 'profound']
    };

    const detectMatches = (keywords) => {
      const matches = [];
      for (const [category, words] of Object.entries(keywords)) {
        const score = words.filter(word => text.includes(word)).length;
        if (score > 0) {
          matches.push({ category, score });
        }
      }
      
      // Sort by score and return top matches
      matches.sort((a, b) => b.score - a.score);
      const topMatches = matches.slice(0, 3).map(m => m.category);
      
      // If no matches, return default
      return topMatches.length > 0 ? topMatches : [Object.keys(keywords)[0]];
    };

    const genres = detectMatches(genreKeywords).slice(0, 3);
    const moods = detectMatches(moodKeywords).slice(0, 2);

    // Determine pace with better logic
    let pace = 'Medium';
    const fastWords = ['fast', 'action', 'thrilling', 'intense', 'explosive', 'rapid'];
    const slowWords = ['slow', 'contemplative', 'peaceful', 'meditative', 'thoughtful'];
    
    const fastCount = fastWords.filter(word => text.includes(word)).length;
    const slowCount = slowWords.filter(word => text.includes(word)).length;
    
    if (fastCount > slowCount && fastCount > 0) {
      pace = 'Fast';
    } else if (slowCount > fastCount && slowCount > 0) {
      pace = 'Slow';
    }

    // Determine age rating with better keywords
    let ageRating = '13+';
    const matureKeywords = ['adult', 'mature', 'violence', 'explicit', 'gore', 'brutal', 'sexual'];
    const teenKeywords = ['teen', 'young adult', 'teenager'];
    const familyKeywords = ['family', 'kids', 'children', 'all ages'];
    
    if (matureKeywords.some(word => text.includes(word))) {
      ageRating = '18+';
    } else if (teenKeywords.some(word => text.includes(word))) {
      ageRating = '15+';
    } else if (familyKeywords.some(word => text.includes(word))) {
      ageRating = 'All Ages';
    }

    // Generate descriptive tags
    const titleWords = title.toLowerCase().split(' ').filter(w => w.length > 4);
    const descWords = description.toLowerCase()
      .split(/[\s,\.]+/)
      .filter(w => w.length > 5 && !['about', 'after', 'before', 'their', 'where', 'which'].includes(w))
      .slice(0, 5);
    
    const tags = [...new Set([
      ...genres.map(g => g.toLowerCase()),
      ...moods.map(m => m.toLowerCase().replace('-', ' ')),
      ...titleWords.slice(0, 2),
      ...descWords.slice(0, 3)
    ])].slice(0, 8);

    return {
      success: true,
      data: {
        genre: genres,
        mood: moods,
        ageRating,
        pace,
        tags
      },
      aiGenerated: false,
      provider: 'local'
    };
  }

  // Generate personalized movie recommendations using Gemini
  async generatePersonalizedSuggestions(userPreferences, watchedMovies) {
    if (!this.useGemini) return this.generatePersonalizedSuggestionsLocally(userPreferences, watchedMovies);

    try {
      const prompt = `Based on a user's movie preferences, suggest what types of movies they might enjoy.

User's favorite genres: ${userPreferences.favoriteGenres?.join(', ') || 'None specified'}
User's favorite moods: ${userPreferences.favoriteMoods?.join(', ') || 'None specified'}
Preferred countries: ${userPreferences.preferredCountries?.join(', ') || 'Any'}

Recently watched movies: ${watchedMovies.slice(0, 5).map(m => m.title).join(', ')}

Provide 3-5 specific genre/mood combinations they would enjoy and explain why in a brief, friendly way.
Format as JSON:
{
  "suggestions": [
    {
      "combination": "Genre + Mood description",
      "reason": "Brief explanation"
    }
  ]
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/g, '');
      }
      
      const suggestions = JSON.parse(cleanText);
      
      return {
        success: true,
        data: suggestions
      };
    } catch (error) {
      const message = error?.message || String(error);
      console.error('Gemini suggestion error:', message);

      // If the configured model is invalid/unsupported, stop retrying (prevents noisy logs).
      if (message.includes('404') || message.toLowerCase().includes('not found')) {
        this.useGemini = false;
      }

      return {
        ...this.generatePersonalizedSuggestionsLocally(userPreferences, watchedMovies),
        message
      };
    }
  }

  generatePersonalizedSuggestionsLocally(userPreferences, watchedMovies) {
    const genres = userPreferences?.favoriteGenres || [];
    const moods = userPreferences?.favoriteMoods || [];
    const countries = userPreferences?.preferredCountries || [];

    const watchedTitles = (watchedMovies || [])
      .slice(0, 10)
      .map(m => m?.title)
      .filter(Boolean);

    const suggestions = [];
    const take = (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : []);

    const topGenres = take(genres, 3);
    const topMoods = take(moods, 3);

    if (topGenres.length || topMoods.length) {
      const combos = [
        { g: topGenres[0], m: topMoods[0] },
        { g: topGenres[1] || topGenres[0], m: topMoods[1] || topMoods[0] },
        { g: topGenres[2] || topGenres[0], m: topMoods[2] || topMoods[0] }
      ].filter(x => x.g || x.m);

      for (const { g, m } of combos.slice(0, 5)) {
        const combo = [g, m].filter(Boolean).join(' + ') || 'Personalized picks';
        const parts = [];
        if (g) parts.push(`you often like ${g}`);
        if (m) parts.push(`you enjoy ${m.toLowerCase()} stories`);
        if (countries.length) parts.push(`you’ve shown interest in ${countries.slice(0, 2).join(', ')}`);
        if (watchedTitles.length) parts.push(`based on what you watched like "${watchedTitles[0]}"`);

        suggestions.push({
          combination: combo,
          reason: parts.length ? `Suggested because ${parts.join(', ')}.` : 'Suggested from your recent activity.'
        });
      }
    }

    if (suggestions.length === 0) {
      suggestions.push(
        { combination: 'Drama + Emotional', reason: 'A safe default that works well for many viewers.' },
        { combination: 'Thriller + Suspenseful', reason: 'Great if you want something gripping and engaging.' },
        { combination: 'Comedy + Lighthearted', reason: 'Good for a relaxed, easy watch.' }
      );
    }

    return {
      success: true,
      data: { suggestions },
      provider: 'local'
    };
  }

  // Analyze a movie description and provide insights
  async analyzeMovieDescription(title, description) {
    if (!this.useGemini) {
      return { success: false, message: 'Gemini AI not available' };
    }

    try {
      const prompt = `Analyze this movie and provide a brief, engaging summary of its key themes and appeal.

Title: ${title}
Description: ${description}

Provide a 2-3 sentence analysis that would help viewers decide if they'd enjoy it.
Just return the text, no JSON formatting needed.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysis = response.text().trim();
      
      return {
        success: true,
        data: analysis
      };
    } catch (error) {
      const message = error?.message || String(error);
      console.error('Gemini analysis error:', message);

      if (message.includes('404') || message.toLowerCase().includes('not found')) {
        this.useGemini = false;
      }

      return {
        success: false,
        message
      };
    }
  }

  // Batch process multiple movies
  async batchGenerateTags(movies, onProgress) {
    const results = [];
    const total = movies.length;
    
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      console.log(`Processing ${i + 1}/${total}: ${movie.title}`);
      
      const tags = await this.generateMovieTags({
        title: movie.title,
        description: movie.description
      });
      
      results.push({
        movieId: movie._id,
        title: movie.title,
        tags,
        success: tags.success
      });
      
      if (onProgress) {
        onProgress(i + 1, total);
      }
      
      // Add delay to respect API rate limits
      if (this.useGemini && i < movies.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }
    
    return results;
  }
}

module.exports = new AIService();