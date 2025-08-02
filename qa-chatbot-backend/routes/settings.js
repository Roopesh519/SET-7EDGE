// qa-chatbot-backend/routes/settings.js
import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-cbc';

// Create a consistent 32-byte key
function getEncryptionKey() {
    return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
}

// Fixed encrypt function
function encrypt(text) {
    if (!text) return null;
    
    try {
        const key = getEncryptionKey();
        const iv = crypto.randomBytes(16); // 16 bytes IV
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // Return IV + encrypted data
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('❌ Encryption error:', error);
        return null;
    }
}

// Fixed decrypt function
function decrypt(encryptedText) {
    if (!encryptedText) return null;
    
    try {
        const key = getEncryptionKey();
        
        // Handle both old and new formats
        if (encryptedText.includes(':')) {
            // New format with IV
            const textParts = encryptedText.split(':');
            const iv = Buffer.from(textParts[0], 'hex');
            const encrypted = textParts[1];
            
            const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } else {
            // Legacy format without IV - use a fixed IV for backward compatibility
            // This handles existing encrypted data in your database
            const iv = Buffer.alloc(16, 0); // Fixed IV filled with zeros
            const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
            
            let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
    } catch (error) {
        console.error('❌ Decryption error:', error);
        console.error('❌ Encrypted text:', encryptedText);
        return null;
    }
}

// GET user settings
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId).select('username email createdAt togetherApiKey');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Don't send the actual API key, just indicate if it exists
        const hasApiKey = !!(user.togetherApiKey);

        res.json({
            user: {
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            },
            hasApiKey
        });
    } catch (error) {
        console.error('❌ Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PUT update API key
router.put('/api-key', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { apiKey } = req.body;

        if (!apiKey || typeof apiKey !== 'string') {
            return res.status(400).json({ error: 'API key is required' });
        }

        // Basic validation for Together.ai API key
        const trimmedKey = apiKey.trim();
        if (trimmedKey.length < 10) {
            return res.status(400).json({ error: 'Invalid API key format' });
        }

        // Test the API key by making a simple request
        try {
            const testResponse = await fetch('https://api.together.ai/v1/models', {
                headers: {
                    'Authorization': `Bearer ${trimmedKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!testResponse.ok) {
                return res.status(400).json({ error: 'Invalid API key. Please check your Together.ai API key.' });
            }
        } catch (testError) {
            console.error('❌ API key validation error:', testError);
            return res.status(400).json({ error: 'Failed to validate API key. Please try again.' });
        }

        // Encrypt and store the API key
        const encryptedApiKey = encrypt(trimmedKey);
        
        if (!encryptedApiKey) {
            return res.status(500).json({ error: 'Failed to encrypt API key' });
        }
        
        await User.findByIdAndUpdate(userId, {
            togetherApiKey: encryptedApiKey
        });

        res.json({ message: 'API key updated successfully' });
    } catch (error) {
        console.error('❌ Error updating API key:', error);
        res.status(500).json({ error: 'Failed to update API key' });
    }
});

// DELETE remove API key
router.delete('/api-key', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        
        await User.findByIdAndUpdate(userId, {
            $unset: { togetherApiKey: 1 }
        });

        res.json({ message: 'API key removed successfully' });
    } catch (error) {
        console.error('❌ Error removing API key:', error);
        res.status(500).json({ error: 'Failed to remove API key' });
    }
});

// Helper function to get user's API key (for use in other routes)
export async function getUserApiKey(userId) {
    try {
        console.log('🔍 Getting API key for user:', userId);
        const user = await User.findById(userId).select('togetherApiKey');
        
        if (user && user.togetherApiKey) {
            console.log('🔑 Found encrypted API key, attempting to decrypt...');
            const decryptedKey = decrypt(user.togetherApiKey);
            
            if (decryptedKey) {
                console.log('✅ Successfully decrypted API key');
                return decryptedKey;
            } else {
                console.log('❌ Failed to decrypt API key');
                return null;
            }
        }
        
        console.log('ℹ️ No API key found for user, using system default');
        return null; // Use system default
    } catch (error) {
        console.error('❌ Error getting user API key:', error);
        return null;
    }
}

export default router;