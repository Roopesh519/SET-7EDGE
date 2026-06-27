import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Comprehensive input validation
  const validateInputs = () => {
    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return false;
    }

    // Username validation
    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return false;
    }

    if (username.length > 20) {
      setError('Username must be less than 20 characters.');
      return false;
    }

    // Check for valid username characters
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      setError('Username can only contain letters, numbers, hyphens, and underscores.');
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    if (password.length > 128) {
      setError('Password must be less than 128 characters.');
      return false;
    }

    // Check for password strength (optional)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
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
        return 'Invalid registration data. Please check your inputs.';
      case 409:
        return 'An account with this email or username already exists.';
      case 422:
        return 'Registration data is invalid. Please check all fields.';
      case 429:
        return 'Too many registration attempts. Please try again later.';
      case 500:
        return 'Server error during registration. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Registration service temporarily unavailable. Please try again later.';
      default:
        return 'Registration failed. Please try again.';
    }
  };

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const register = async () => {
    setError('');

    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password
      });

      if (response?.token) {
        navigate('/chat');
      } else {
        localStorage.setItem('registrationSuccess', 'Registration successful! Please log in.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const status = err.response?.status;
      const payload = err.response?.data;
      const errorMessage = payload?.error || payload?.message || getErrorMessage(payload, status);
      setError(errorMessage || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      register();
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
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

        <h2 className="text-white text-xl font-semibold mb-6 text-center">Register</h2>

        <input
          type="text"
          placeholder="Username (3-20 characters)"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          maxLength={20}
        />

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
            placeholder="Password (min 6 chars, mixed case + numbers)"
            className="w-full px-4 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            maxLength={128}
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
          onClick={register}
          disabled={loading}
          className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm text-center mb-4" role="alert">
            <span className="block">{error}</span>
          </div>
        )}

        {/* Login link */}
        <div className="text-center">
          <p className="text-white text-sm mb-2">Already have an account?</p>
          <button
            onClick={navigateToLogin}
            className="text-green-200 hover:text-white text-sm underline transition-colors"
            disabled={loading}
          >
            Sign in to your account
          </button>
        </div>
      </div>
    </div>
  );
}