import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextStore';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Additional auth utilities
export const useAuthStatus = () => {
  const { user, loading } = useAuth();
  
  return {
    isAuthenticated: !!user,
    isLoading: loading,
    user
  };
};

export const useRequireAuth = (redirectTo = '/login') => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate(redirectTo);
    }
  }, [user, loading, navigate, redirectTo]);
  
  return { user, loading };
};