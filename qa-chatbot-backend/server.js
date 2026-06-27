// qa-chatbot-backend/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import settingsRoutes from './routes/settings.js';

dotenv.config(); // ✅ Load env before importing routes

const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'ENCRYPTION_KEY', 'HF_TOKEN'];
const missingVars = requiredEnv.filter(key => !process.env[key]);
if (missingVars.length) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import profileRoutes from './routes/profile.js';
import adminRoutes from './routes/admin.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);
app.use(helmet());

const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean)
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      // Allow non-browser requests like Postman or server-to-server calls
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`Blocked CORS origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);
    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 80,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});
app.use('/api', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

const connectToMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');
};

const isVercel = Boolean(process.env.VERCEL);

if (isVercel) {
  connectToMongo().catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
} else {
  connectToMongo()
    .then(() => {
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 The Server is running on http://0.0.0.0:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
    });
}

export default app;
