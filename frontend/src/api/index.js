import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Movie APIs
export const movieAPI = {
  getAll: (params) => api.get('/movies', { params }),
  getOne: (id) => api.get(`/movies/${id}`),
  getTrending: (limit) => api.get('/movies/trending', { params: { limit } }),
  getTopRated: (limit) => api.get('/movies/top-rated', { params: { limit } }),
  getRecent: (limit) => api.get('/movies/recent', { params: { limit } }),
  create: (data) => api.post('/movies', data),
  update: (id, data) => api.put(`/movies/${id}`, data),
  delete: (id) => api.delete(`/movies/${id}`),
  rate: (id, rating) => api.post(`/movies/${id}/rate`, { rating }),
};

// Review APIs
export const reviewAPI = {
  getByMovie: (movieId) => api.get(`/reviews/${movieId}`),
  addOrUpdate: (movieId, rating, reviewText) => api.post('/reviews', { movieId, rating, reviewText }),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`)
};

// User APIs
export const userAPI = {
  // Favorites
  getFavorites: () => api.get('/user/favorites'),
  addToFavorites: (movieId) => api.post(`/user/favorites/${movieId}`),
  removeFromFavorites: (movieId) => api.delete(`/user/favorites/${movieId}`),
  
  // Watchlist
  getWatchlist: () => api.get('/user/watchlist'),
  getSmartSortedWatchlist: () => api.get('/user/watchlist/smart-sort'),
  addToWatchlist: (movieId) => api.post(`/user/watchlist/${movieId}`),
  addBulkToWatchlist: (movieIds) => api.post('/user/watchlist/bulk', { movieIds }),
  removeFromWatchlist: (movieId) => api.delete(`/user/watchlist/${movieId}`),
  
  // Recommendations
  getRecommendations: (limit) => api.get('/user/recommendations', { params: { limit } }),
  getWatchlistRecommendations: (limit) => api.get('/user/watchlist/recommendations', { params: { limit } }),
  
  // Search history
  addSearchHistory: (query) => api.post('/user/search-history', { query }),
  
  // Preferences
  updatePreferences: (preferences) => api.put('/user/preferences', { preferences }),
  
  // AI Features
  generateTags: (data) => api.post('/user/ai/generate-tags', data),
  bulkGenerateTags: (limit) => api.post('/user/ai/bulk-generate-tags', { limit }),
  getAISuggestions: () => api.get('/user/ai/suggestions'),
  analyzeMovie: (data) => api.post('/user/ai/analyze', data),
};

export default api;