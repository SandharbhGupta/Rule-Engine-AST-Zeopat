// Assuming you have a Rule model defined
const express = require('express');
const router = express.Router();
const Rule = require('../models/Rule'); // Your Rule model

// Get the last stored AST
router.get('/last_ast', async (req, res) => {
  try {
    const lastRule = await Rule.findOne().sort({ createdAt: -1 }); // Assuming you have a createdAt field
    if (!lastRule) {
      return res.status(404).json({ message: 'No rules found.' });
    }
    res.json({ ast: lastRule.ast });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch the last AST. ' + error.message });
  }
});

module.exports = router;
