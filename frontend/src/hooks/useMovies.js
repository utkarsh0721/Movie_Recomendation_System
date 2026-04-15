import { useState, useEffect, useCallback } from 'react';
import { movieAPI } from '../api';

export const useMovies = (initialParams = {}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState(initialParams);

  const fetchMovies = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await movieAPI.getAll({ ...filters, ...params });
      setMovies(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ page: 1, limit: 20 });
  }, []);

  const goToPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  return {
    movies,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    clearFilters,
    goToPage,
    refetch: fetchMovies
  };
};

export const useTrendingMovies = (limit = 10) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await movieAPI.getTrending(limit);
        setMovies(response.data.data);
      } catch (error) {
        console.error('Failed to fetch trending movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [limit]);

  return { movies, loading };
};

export const useTopRatedMovies = (limit = 10) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const response = await movieAPI.getTopRated(limit);
        setMovies(response.data.data);
      } catch (error) {
        console.error('Failed to fetch top rated movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopRated();
  }, [limit]);

  return { movies, loading };
};

export const useRecentMovies = (limit = 10) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await movieAPI.getRecent(limit);
        setMovies(response.data.data);
      } catch (error) {
        console.error('Failed to fetch recent movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, [limit]);

  return { movies, loading };
};

export const useMovieDetail = (id) => {
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovie = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await movieAPI.getOne(id);
      setMovie(response.data.data);
      setSimilarMovies(response.data.data.similarMovies || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movie');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  return { movie, similarMovies, loading, error, refetch: fetchMovie };
};