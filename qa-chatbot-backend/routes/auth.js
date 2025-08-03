import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Notice the .js extension

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ 
      username, 
      email, 
      password: hash,
      isAdmin: false // Explicitly set to false for new registrations
    });
    await user.save();
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Incorrect password' });

    const token = jwt.sign({ 
      id: user._id, 
      userId: user._id // Add userId for consistency with admin middleware
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Return user info including admin status
    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin || false, // Include admin status
        trialPromptsUsed: user.trialPromptsUsed || 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Add /me route to check current user info (including admin status)
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Handle both id and userId from token (for backward compatibility)
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId).select('-password -togetherApiKey');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
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
    console.error('Auth /me error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
