import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const router = express.Router();

// Enable CORS for frontend requests
router.use(cors({ origin: '*' }));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET Route - Test API
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

// POST Route - Generate Image
router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Use correct OpenAI method
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    if (!aiResponse || !aiResponse.data || aiResponse.data.length === 0) {
      throw new Error('Invalid response from OpenAI');
    }

    const image = aiResponse.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({
      error: error?.response?.data?.error?.message || 'Something went wrong',
    });
  }
});

export default router;