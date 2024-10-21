const express = require('express');
const { createRule, evaluateRule } = require('../controllers/ruleController');
const router = express.Router();

// Route to create a new rule
router.post('/create_rule', createRule);

// Route to evaluate user data against rules
router.post('/evaluate_rule', evaluateRule);

module.exports = router;
