import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('🔐 Token:', token);
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// admin middleware 
const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('🔐 Admin Token:', token);
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.userId).select('-password -togetherApiKey');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Export both middlewares
export default authMiddleware;
export { adminMiddleware };