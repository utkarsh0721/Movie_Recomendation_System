import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import MovieDetail from './pages/MovieDetail';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-950">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/watchlist" 
                element={
                  <ProtectedRoute>
                    <Watchlist />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#343541',
                color: '#ececf1',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#22d3ee',
                  secondary: '#343541',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#343541',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;