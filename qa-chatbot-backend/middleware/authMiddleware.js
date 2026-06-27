import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied', code: 'AUTH_REQUIRED' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: verified.userId || verified.id,
      email: verified.email
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
  }
};

const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided', code: 'AUTH_REQUIRED' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.userId || verified.id).select('-password -togetherApiKey');

    if (!user) {
      return res.status(401).json({ error: 'User not found', code: 'USER_NOT_FOUND' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required', code: 'ADMIN_REQUIRED' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
  }
};

export default authMiddleware;
export { adminMiddleware };