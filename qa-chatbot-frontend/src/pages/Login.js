import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Input validation
  const validateInputs = () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    return true;
  };

  // Enhanced error message mapping
  const getErrorMessage = (errorData, status) => {
    // Check if server provided a specific error message
    if (errorData?.error) {
      return errorData.error;
    }

    // Map common HTTP status codes to user-friendly messages
    switch (status) {
      case 400:
        return 'Invalid email or password format.';
      case 401:
        return 'Invalid email or password. Please try again.';
      case 403:
        return 'Account access denied. Please contact support.';
      case 404:
        return 'Account not found. Please check your email.';
      case 429:
        return 'Too many login attempts. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return 'Login failed. Please try again.';
    }
  };

  const { login: loginUser } = useAuth();
  const navigate = useNavigate();

  const login = async () => {
    setError('');

    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      await loginUser({ email: email.trim(), password });
      navigate('/chat');
    } catch (err) {
      console.error('Login error:', err);
      const status = err.response?.status;
      const payload = err.response?.data;
      const errorMessage = payload?.error || payload?.message || getErrorMessage(payload, status);
      setError(errorMessage || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4 bg-white bg-opacity-90 border border-white border-opacity-20 rounded-xl p-4 shadow-lg">
            <img src="7EDGE.png" alt="Logo" className="w-44 h-15 rounded-lg object-cover" />
          </div>
        </div>

        <h2 className="text-white text-xl font-semibold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <div className="relative w-full mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full px-4 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm text-center mb-4" role="alert">
            <span className="block">{error}</span>
          </div>
        )}

        {/* Registration link */}
        <div className="text-center">
          <p className="text-white text-sm mb-2">Don't have an account?</p>
          <button
            onClick={navigateToRegister}
            className="text-blue-200 hover:text-white text-sm underline transition-colors"
            disabled={loading}
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}