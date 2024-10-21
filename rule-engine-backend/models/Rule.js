const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  rule: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  ast: {
    type: Object,
    required: true,
  },
}, { timestamps: true });

const Rule = mongoose.model('Rule', ruleSchema);

module.exports = Rule;
