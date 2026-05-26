const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema(
  {
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    dna:           { type: String, required: true },
    pattern:       { type: String, required: true },
    matches:       { type: [Number], default: [] },
    comparisons:   { type: Number, default: 0 },
    shifts:        { type: Number, default: 0 },
    skipped:       { type: Number, default: 0 },
    executionTime: { type: Number, default: 0 },
    algorithm:     { type: String, default: 'horspool' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Search', searchSchema);
