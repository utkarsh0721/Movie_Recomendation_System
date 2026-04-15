// Format movie duration
export const formatDuration = (duration) => {
  if (!duration) return 'N/A';
  return duration;
};

// Format release year
export const formatYear = (year) => {
  return year || 'N/A';
};

// Format rating
export const formatRating = (rating) => {
  if (!rating || rating === 0) return 'N/A';
  return rating.toFixed(1);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Get genre color
export const getGenreColor = (genre) => {
  const colors = {
    'Action': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Thriller': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Romance': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Comedy': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Drama': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Horror': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Sci-Fi': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Mystery': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'Fantasy': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    'Adventure': 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  
  return colors[genre] || 'bg-dark-700 text-dark-300 border-dark-600';
};

// Get mood color
export const getMoodColor = (mood) => {
  const colors = {
    'Fast-paced': 'bg-red-500/20 text-red-400',
    'Slow-paced': 'bg-blue-500/20 text-blue-400',
    'Emotional': 'bg-purple-500/20 text-purple-400',
    'Lighthearted': 'bg-yellow-500/20 text-yellow-400',
    'Dark': 'bg-gray-500/20 text-gray-400',
    'Feel-good': 'bg-green-500/20 text-green-400',
    'Suspenseful': 'bg-orange-500/20 text-orange-400',
    'Intense': 'bg-pink-500/20 text-pink-400',
  };
  
  return colors[mood] || 'bg-dark-700 text-dark-300';
};

// Check if image URL is valid
export const isValidImageUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
};

// Get fallback image
export const getFallbackImage = () => {
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"%3E%3Crect fill="%23343541" width="400" height="600"/%3E%3Ctext fill="%23565869" font-family="sans-serif" font-size="30" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
};

// Parse YouTube URL
export const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Format number with commas
export const formatNumber = (num) => {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Calculate time ago
export const timeAgo = (date) => {
  if (!date) return '';
  
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
};