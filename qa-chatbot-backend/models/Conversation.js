import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  prompt: String,
  response: String,
  timestamp: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  userId: String,
  title: String,
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
