// qa-chatbot-backend/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import settingsRoutes from './routes/settings.js';

dotenv.config(); // ✅ Load env before importing routes

console.log('🔐 JWT_SECRET loaded:', !!process.env.JWT_SECRET);
console.log('🔑 TOGETHER_API_KEY loaded:', !!process.env.TOGETHER_API_KEY);
console.log('🛢️ MONGO_URI loaded:', !!process.env.MONGO_URI);

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import profileRoutes from './routes/profile.js';
import adminRoutes from './routes/admin.js'; // Add this import

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes); // Add this line

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 The Server is running on http://0.0.0.0:${PORT}`);
    });    
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });


