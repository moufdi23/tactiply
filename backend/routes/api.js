const express = require('express');
const router = express.Router();
const { generateQuestions, generateStrategy } = require('../services/claude');

router.post('/questions', async (req, res) => {
  try {
    const { businessDescription } = req.body;
    if (!businessDescription?.trim()) {
      return res.status(400).json({ error: 'Business description is required' });
    }
    const questions = await generateQuestions(businessDescription.trim());
    res.json({ questions });
  } catch (err) {
    console.error('Questions error:', err.message);
    res.status(500).json({ error: 'Failed to generate questions. Please try again.' });
  }
});

router.post('/strategy', async (req, res) => {
  try {
    const { businessDescription, answers } = req.body;
    if (!businessDescription?.trim() || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Business description and answers are required' });
    }
    const strategy = await generateStrategy(businessDescription.trim(), answers);
    res.json({ strategy });
  } catch (err) {
    console.error('Strategy error:', err.message);
    res.status(500).json({ error: 'Failed to generate strategy. Please try again.' });
  }
});

module.exports = router;
