import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get dashboard analytics
router.get('/analytics', adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalConversations = await Conversation.countDocuments();
    const totalMessages = await Conversation.aggregate([
      { $unwind: '$messages' },
      { $count: 'total' }
    ]);

    // Users registered in last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    // Daily active users (users who had conversations today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyActiveUsers = await Conversation.distinct('userId', {
      createdAt: { $gte: today }
    });

    // Trial usage statistics
    const trialUsageStats = await User.aggregate([
      {
        $group: {
          _id: '$trialPromptsUsed',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Registration trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const registrationTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Usage patterns (messages per day for last 30 days)
    const usagePatterns = await Conversation.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          conversations: { $sum: 1 },
          messages: { $sum: { $size: '$messages' } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalConversations,
        totalMessages: totalMessages[0]?.total || 0,
        newUsersThisWeek,
        dailyActiveUsers: dailyActiveUsers.length
      },
      trialUsageStats,
      registrationTrends,
      usagePatterns
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

// Get all users with pagination
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const searchQuery = search ? {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(searchQuery)
      .select('-password -togetherApiKey')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(searchQuery);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get user details with conversation stats
router.get('/users/:id', adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -togetherApiKey');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const conversationCount = await Conversation.countDocuments({ userId: req.params.id });
    const conversations = await Conversation.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10);

    const totalMessages = await Conversation.aggregate([
      { $match: { userId: req.params.id } },
      { $unwind: '$messages' },
      { $count: 'total' }
    ]);

    res.json({
      user,
      stats: {
        conversationCount,
        totalMessages: totalMessages[0]?.total || 0
      },
      recentConversations: conversations
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
});

// Create new user
router.post('/users', adminMiddleware, async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false
    });

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.togetherApiKey;

    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Update user
router.put('/users/:id', adminMiddleware, async (req, res) => {
  try {
    const { username, email, isAdmin, trialPromptsUsed } = req.body;
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (typeof isAdmin === 'boolean') updateData.isAdmin = isAdmin;
    if (typeof trialPromptsUsed === 'number') updateData.trialPromptsUsed = Math.max(0, Math.min(5, trialPromptsUsed));

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password -togetherApiKey');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Reset user password
router.post('/users/:id/reset-password', adminMiddleware, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
});

// Delete user and their conversations
router.delete('/users/:id', adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's conversations
    await Conversation.deleteMany({ userId: req.params.id });
    
    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Delete user's API key
router.delete('/users/:id/api-key', adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { 
      $unset: { togetherApiKey: 1 } 
    });
    
    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting API key', error: error.message });
  }
});

// Get conversations with search and pagination
router.get('/conversations', adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.query.userId;
    const skip = (page - 1) * limit;

    const query = userId ? { userId } : {};

    const conversations = await Conversation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get usernames for each conversation
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conv) => {
        const user = await User.findById(conv.userId).select('username email');
        return {
          ...conv.toObject(),
          user: user || { username: 'Deleted User', email: '' }
        };
      })
    );

    const total = await Conversation.countDocuments(query);

    res.json({
      conversations: conversationsWithUsers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
});

// Get specific conversation with full details
router.get('/conversations/:id', adminMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const user = await User.findById(conversation.userId).select('username email');
    
    res.json({
      ...conversation.toObject(),
      user: user || { username: 'Deleted User', email: '' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversation', error: error.message });
  }
});

// Export conversations to CSV
router.get('/export/conversations', adminMiddleware, async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const conversations = await Conversation.find(query).sort({ createdAt: -1 });
    
    // Flatten conversations for CSV export
    const csvData = [];
    for (const conv of conversations) {
      const user = await User.findById(conv.userId).select('username email');
      
      for (let i = 0; i < conv.messages.length; i++) {
        const message = conv.messages[i];
        csvData.push({
          conversationId: conv._id,
          conversationTitle: conv.title,
          username: user?.username || 'Deleted User',
          email: user?.email || '',
          messageIndex: i + 1,
          prompt: message.prompt,
          response: message.response,
          messageTimestamp: message.timestamp,
          conversationCreated: conv.createdAt
        });
      }
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=conversations-export.csv');
    
    // Simple CSV generation
    const headers = Object.keys(csvData[0] || {});
    let csv = headers.join(',') + '\n';
    
    csvData.forEach(row => {
      csv += headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
    });
    
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting conversations', error: error.message });
  }
});

export default router;