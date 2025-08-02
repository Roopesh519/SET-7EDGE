import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  userId: String,
  prompt: String,
  response: String,
  timestamp: { type: Date, default: Date.now }
});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistory;
