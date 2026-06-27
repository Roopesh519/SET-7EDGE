import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new ApiError('Username, email, and password are required.', 400, 'VALIDATION_ERROR');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError('A user with this email already exists.', 409, 'USER_EXISTS');
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ 
      username, 
      email, 
      password: hash,
      isAdmin: false
    });
    await user.save();
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    console.error('Registration error:', err);
    next(new ApiError('Registration failed', 500, 'REGISTRATION_FAILED'));
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError('Invalid email or password.', 401, 'AUTHENTICATION_FAILED');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ApiError('Invalid email or password.', 401, 'AUTHENTICATION_FAILED');
    }

    const token = jwt.sign({ 
      id: user._id, 
      userId: user._id,
      email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin || false,
        trialPromptsUsed: user.trialPromptsUsed || 0
      }
    });
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    }
    console.error('Login error:', err);
    next(new ApiError('Login failed', 500, 'LOGIN_FAILED'));
  }
});

// Add /me route to check current user info (including admin status)
router.get('/me', async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new ApiError('No token provided', 401, 'AUTH_REQUIRED');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId).select('-password -togetherApiKey');
    if (!user) {
      throw new ApiError('User not found', 401, 'USER_NOT_FOUND');
    }

    res.json({ 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin || false,
        trialPromptsUsed: user.trialPromptsUsed || 0,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError('Token expired', 401, 'TOKEN_EXPIRED'));
    }
    console.error('Auth /me error:', error);
    next(new ApiError('Invalid token', 401, 'INVALID_TOKEN'));
  }
});

// Add refresh token endpoint
router.post('/refresh', async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new ApiError('No token provided', 401, 'AUTH_REQUIRED');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        decoded = jwt.decode(token);
      } else {
        throw error;
      }
    }

    if (!decoded) {
      throw new ApiError('Invalid token', 401, 'INVALID_TOKEN');
    }

    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId).select('-password -togetherApiKey');
    if (!user) {
      throw new ApiError('User not found', 401, 'USER_NOT_FOUND');
    }

    const newToken = jwt.sign({ 
      id: user._id, 
      userId: user._id,
      email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      token: newToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin || false,
        trialPromptsUsed: user.trialPromptsUsed || 0
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    console.error('Token refresh error:', error);
    next(new ApiError('Token refresh failed', 401, 'TOKEN_REFRESH_FAILED'));
  }
});

export default router;
