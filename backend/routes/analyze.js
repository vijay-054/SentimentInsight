const express = require('express');
const { HfInference } = require('@huggingface/inference');
const db = require('../database');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
const hf = new HfInference(process.env.HF_TOKEN);

router.post('/', authenticateToken, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Perform sentiment analysis
    const result = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: text
    });
    
    // Result is usually an array of objects like [{ label: 'POSITIVE', score: 0.99 }, { label: 'NEGATIVE', score: 0.01 }]
    const topResult = result.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    
    let sentiment = topResult.label === 'POSITIVE' ? 'Positive' : 'Negative';
    if (topResult.score < 0.6) sentiment = 'Neutral';

    // Extract keywords (simple implementation for now)
    const keywords = text.split(/\s+/).filter(w => w.length > 4).slice(0, 5).join(',');

    // Save to database
    db.run(
      'INSERT INTO history (userId, text, sentiment, confidence, keywords) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, text, sentiment, topResult.score, keywords],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          id: this.lastID,
          sentiment,
          confidence: topResult.score,
          text,
          keywords: keywords.split(','),
          created_at: new Date().toISOString()
        });
      }
    );

  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

module.exports = router;
