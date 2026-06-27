import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import HomePage from './pages/HomePage';
import About from './pages/AboutUsPage';
import AdminDashboard from './pages/AdminDashboard';
import SessionExpiredModal from './components/modals/SessionExpiredModal';
import SessionStatus from './components/SessionStatus';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-sm sm:text-base">Loading authentication state...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/chat" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/chat" />}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <Chat /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/about"
          element={isAuthenticated ? <About /> : <Navigate to="/login" />}
        />
        {/* Add admin route - protected by login and admin check happens in component */}
        <Route
          path="/admin"
          element={isAuthenticated ? (user?.isAdmin ? <AdminDashboard /> : <Navigate to="/chat" />) : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />}
        />
      </Routes>
      
      {/* Add the SessionExpiredModal - it will only show when needed */}
      <SessionExpiredModal />
      
      {/* Add the SessionStatus - shows session refresh status */}
      <SessionStatus />
    </Router>
  );
};

export default App;