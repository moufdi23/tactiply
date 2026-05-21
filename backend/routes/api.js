const express = require('express');
const router  = express.Router();
const {
  generateQuestions,
  generateStrategy,
  generateCompetitorAnalysis,
  regenerateSection,
} = require('../services/claude');

// ── Generate 5 questions ───────────────────────────────────────────────────
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

// ── Generate full strategy ─────────────────────────────────────────────────
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

// ── Competitor analysis ────────────────────────────────────────────────────
router.post('/competitor', async (req, res) => {
  try {
    const { businessDescription, answers = [], competitorName } = req.body;
    if (!businessDescription?.trim() || !competitorName?.trim()) {
      return res.status(400).json({ error: 'Business description and competitor name are required' });
    }
    const analysis = await generateCompetitorAnalysis(
      businessDescription.trim(),
      answers,
      competitorName.trim()
    );
    res.json({ analysis });
  } catch (err) {
    console.error('Competitor error:', err.message);
    res.status(500).json({ error: 'Failed to generate competitor analysis. Please try again.' });
  }
});

// ── Regenerate one section ─────────────────────────────────────────────────
router.post('/regenerate', async (req, res) => {
  try {
    const { businessDescription, answers = [], sectionKey } = req.body;
    if (!businessDescription?.trim() || !sectionKey) {
      return res.status(400).json({ error: 'Business description and section key are required' });
    }
    const content = await regenerateSection(
      businessDescription.trim(),
      answers,
      sectionKey
    );
    res.json({ content });
  } catch (err) {
    console.error('Regenerate error:', err.message);
    res.status(500).json({ error: 'Failed to regenerate section. Please try again.' });
  }
});

module.exports = router;
