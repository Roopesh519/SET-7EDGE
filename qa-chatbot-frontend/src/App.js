import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import ChatPage from './pages/Chat'; // Your chatbot UI
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage'; // Add this import
import HomePage from './pages/HomePage';
import About from './pages/AboutUsPage';
import AdminDashboard from './pages/AdminDashboard'; // Add this import
import SessionExpiredModal from './components/modals/SessionExpiredModal'; // Add this import

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Listen to storage changes from login/logout
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/chat" />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <Register /> : <Navigate to="/chat" />}
        />
        <Route
          path="/chat"
          element={isLoggedIn ? <Chat /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isLoggedIn ? <SettingsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/about"
          element={isLoggedIn ? <About /> : <Navigate to="/login" />}
        />
        {/* Add admin route - protected by login and admin check happens in component */}
        <Route
          path="/admin"
          element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/chat" : "/login"} />}
        />
      </Routes>
      
      {/* Add the SessionExpiredModal - it will only show when needed */}
      <SessionExpiredModal />
    </Router>
  );
};

export default App;