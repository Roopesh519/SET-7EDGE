import express from 'express';
import ChatHistory from '../models/ChatHistory.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Together from 'together-ai';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js'; // Import User model
import multer from 'multer';
import fs from 'fs';
import path from 'path';
// import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import { getUserApiKey } from './settings.js';

const router = express.Router();

const TRIAL_LIMIT = 5;

let together = null;

// Initialize default system client
function initializeSystemClient() {
  if (!together) {
    if (!process.env.TOGETHER_API_KEY) {
      console.warn('⚠️ TOGETHER_API_KEY is missing from env!');
      return null;
    }
    together = new Together({
      apiKey: process.env.TOGETHER_API_KEY
    });
    console.log('🧠 Together system client initialized');
  }
  return together;
}

async function getTogetherClient(userId, apiKey = null) {
  // If user has their own API key, create a new instance with it
  if (apiKey) {
    return new Together({
      apiKey: apiKey
    });
  }
  
  // Check trial usage for users without API key
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // If user has exhausted trial prompts and no API key
  if (user.trialPromptsUsed >= TRIAL_LIMIT) {
    throw new Error('TRIAL_EXHAUSTED');
  }
  
  // Use system client for trial users
  const systemClient = initializeSystemClient();
  if (!systemClient) {
    throw new Error('System API key not configured');
  }
  
  return systemClient;
}

// Function to increment trial usage
async function incrementTrialUsage(userId) {
  await User.findByIdAndUpdate(
    userId,
    { $inc: { trialPromptsUsed: 1 } },
    { new: true }
  );
}

// POST message to existing conversation or create a new one
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user?.id;
  const { messages, conversationId } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  // Check that the last message is from user
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== 'user' || typeof lastMessage.content !== 'string') {
    return res.status(400).json({ error: 'Last message must be from user and must be a string' });
  }

  try {
    // Get user's API key if they have one
    const userApiKey = await getUserApiKey(userId);
    const client = await getTogetherClient(userId, userApiKey);

    // Add a system prompt at the top, always
    const messagesWithSystem = [
      { role: "system", content: "You are a QA assistant. Help testers with automation, BDD, and TDD." },
      ...messages
    ];

    const response = await client.chat.completions.create({
      messages: messagesWithSystem,
      model: "deepseek-ai/DeepSeek-V3"
    });

    const reply = response.choices?.[0]?.message?.content || '[No reply]';
    let conversation;

    // Save only the last exchange for storage
    const userMessage = lastMessage.content;

    // Increment trial usage if user doesn't have their own API key
    if (!userApiKey) {
      await incrementTrialUsage(userId);
    }

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (conversation) {
        conversation.messages.push({ prompt: userMessage, response: reply });
        await conversation.save();
      }
    }

    // If no conversation or invalid ID, create new
    if (!conversation) {
      conversation = new Conversation({
        userId,
        title: userMessage.slice(0, 30),
        messages: [{ prompt: userMessage, response: reply }]
      });
      await conversation.save();
    }

    // Get updated user info to send remaining trial count
    const updatedUser = await User.findById(userId);
    const remainingTrialPrompts = userApiKey ? null : Math.max(0, TRIAL_LIMIT - updatedUser.trialPromptsUsed);

    res.json({ 
      reply, 
      conversationId: conversation._id,
      remainingTrialPrompts
    });
  } catch (err) {
    console.error('❌ Chat error:', err.message);
    
    // Handle trial exhausted error
    if (err.message === 'TRIAL_EXHAUSTED') {
      return res.status(403).json({ 
        error: 'Trial limit reached. Please add your own Together.ai API key in settings to continue.',
        code: 'TRIAL_EXHAUSTED'
      });
    }
    
    // Handle API key related errors
    if (err.message.includes('401') || err.message.includes('Unauthorized')) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your Together.ai API key in settings.',
        code: 'INVALID_API_KEY'
      });
    }
    
    if (err.message.includes('quota') || err.message.includes('limit')) {
      return res.status(429).json({ 
        error: 'API quota exceeded. Please check your Together.ai account.',
        code: 'QUOTA_EXCEEDED'
      });
    }
    
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET trial status
router.get('/trial-status', authMiddleware, async (req, res) => {
  const userId = req.user?.id;
  
  try {
    const user = await User.findById(userId);
    const userApiKey = await getUserApiKey(userId);
    
    if (userApiKey) {
      return res.json({ 
        hasApiKey: true,
        trialPromptsUsed: 0,
        remainingTrialPrompts: null
      });
    }
    
    const remainingTrialPrompts = Math.max(0, TRIAL_LIMIT - user.trialPromptsUsed);
    
    res.json({
      hasApiKey: false,
      trialPromptsUsed: user.trialPromptsUsed,
      remainingTrialPrompts
    });
  } catch (err) {
    console.error('❌ Error fetching trial status:', err.message);
    res.status(500).json({ error: 'Failed to fetch trial status' });
  }
});

// Fetch chat history
router.get('/history', authMiddleware, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: no user ID found' });
  }

  try {
    const history = await ChatHistory.find({ userId })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(20); // Limit number of responses (optional)
    
    res.json({ history });
  } catch (err) {
    console.error('❌ Error fetching chat history:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

router.get('/conversations', authMiddleware, async (req, res) => {
  const userId = req.user?.id;
  const conversations = await Conversation.find({ userId })
    .sort({ createdAt: -1 })
    .select('title createdAt'); // only show needed fields

  res.json({ conversations });
});

router.get('/conversations/:id', authMiddleware, async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

  res.json({ messages: conversation.messages });
});

// DELETE conversation
router.delete('/conversations/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  await Conversation.findByIdAndDelete(id);
  res.json({ success: true });
});

// PATCH rename conversation
router.patch('/conversations/:id', authMiddleware, async (req, res) => {
  console.log('🔧 PATCH route hit!', {
    id: req.params.id,
    body: req.body,
    headers: req.headers
  });
  
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    if (!title) {
      console.log('❌ No title provided');
      return res.status(400).json({ error: 'Title is required' });
    }
    
    console.log('🔍 Looking for conversation with ID:', id);
    const updated = await Conversation.findByIdAndUpdate(id, { title }, { new: true });
    
    if (!updated) {
      console.log('❌ Conversation not found');
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    console.log('✅ Conversation updated:', updated);
    res.json(updated);
  } catch (error) {
    console.error('❌ Error in PATCH route:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// 🗂️ Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// 📎 POST /chat/upload — Upload file and ask about it
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  const { conversationId, followupQuestion } = req.body;
  const userId = req.user?.id;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  let extractedText = '';
  const ext = path.extname(file.originalname).toLowerCase();

  try {
    // 🧠 Extract text based on file type
    if (ext === '.pdf') {
      const pdfParse = (await import('pdf-parse')).default;
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const ocrResult = await Tesseract.recognize(file.path, 'eng');
      extractedText = ocrResult.data.text;
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'No text found in file' });
    }

    // 🤖 Ask Together AI about the extracted content using user's API key if available
    const userApiKey = await getUserApiKey(userId);
    const client = await getTogetherClient(userId, userApiKey);
    
    const messages = [
      { role: 'system', content: 'You are a helpful assistant. Answer based on the file content provided.' },
      { role: 'user', content: `Here is the content of the uploaded file:\n\n${extractedText}` }
    ];

    if (followupQuestion) {
      messages.push({ role: 'user', content: followupQuestion });
    }

    const response = await client.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-V3',
      messages
    });

    const reply = response.choices?.[0]?.message?.content || '[No reply]';

    // Increment trial usage if user doesn't have their own API key
    if (!userApiKey) {
      await incrementTrialUsage(userId);
    }

    // 💾 Save to conversation if exists
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (conversation) {
        conversation.messages.push({
          prompt: `📎 Uploaded: ${file.originalname}${followupQuestion ? `\n❓ ${followupQuestion}` : ''}`,
          response: reply
        });
        await conversation.save();
      }
    }

    // Get updated user info to send remaining trial count
    const updatedUser = await User.findById(userId);
    const remainingTrialPrompts = userApiKey ? null : Math.max(0, 3 - updatedUser.trialPromptsUsed);

    res.json({ 
      reply, 
      fileName: file.originalname,
      remainingTrialPrompts
    });
  } catch (err) {
    console.error('❌ File processing error:', err.message || err);
    
    // Handle trial exhausted error
    if (err.message === 'TRIAL_EXHAUSTED') {
      return res.status(403).json({ 
        error: 'Trial limit reached. Please add your own Together.ai API key in settings to continue.',
        code: 'TRIAL_EXHAUSTED'
      });
    }
    
    // Handle API key related errors for file upload too
    if (err.message.includes('401') || err.message.includes('Unauthorized')) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your Together.ai API key in settings.',
        code: 'INVALID_API_KEY'
      });
    }
    
    res.status(500).json({ error: 'Failed to process uploaded file' });
  }
});

export default router;
