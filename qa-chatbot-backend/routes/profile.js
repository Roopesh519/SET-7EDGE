// routes/profile.js
import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// GET current user profile
router.get('/', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// PUT update name or password
router.put('/', authMiddleware, async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (name) user.username = name;
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
  }

  await user.save();
  res.json({ message: 'Profile updated' });
});

export default router;
