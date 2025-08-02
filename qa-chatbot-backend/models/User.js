import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  togetherApiKey: {
    type: String,
    default: null // Encrypted API key
  },
  trialPromptsUsed: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;