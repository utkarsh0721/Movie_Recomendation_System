import { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, TrendingUp } from 'lucide-react';
import { userAPI } from '../api';
import LoadingSpinner from './LoadingSpinner';

const AISuggestions = () => {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAISuggestions();
      if (response.data.success && response.data.data) {
        setSuggestions(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center h-40">
          <LoadingSpinner text="Getting AI suggestions..." />
        </div>
      </div>
    );
  }

  if (error || !suggestions) {
    return null;
  }

  return (
    <div className="card p-6 mb-8 border-2 border-primary-500/20 bg-gradient-to-br from-dark-900 to-dark-800">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold gradient-text">AI Suggestions for You</h3>
        <span className="px-2 py-1 rounded-full bg-accent-500/20 text-accent-400 text-xs font-medium">
        
        </span>
      </div>

      <div className="space-y-3">
        {suggestions.suggestions?.map((suggestion, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-dark-800/50 border border-dark-700 hover:border-primary-500/50 
                     transition-all duration-300 group"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
                <Lightbulb className="w-5 h-5 text-primary-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                  {suggestion.combination}
                </h4>
                <p className="text-sm text-dark-300 leading-relaxed">
                  {suggestion.reason}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISuggestions;