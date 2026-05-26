const Search = require('../models/Search');
const { horspoolSearch, naiveSearch, validateDNA } = require('../utils/horspool');

exports.runSearch = async (req, res) => {
  try {
    const { dna, pattern, compare } = req.body;
    if (!dna || !pattern) return res.status(400).json({ error: 'dna and pattern are required' });
    if (!validateDNA(dna) || !validateDNA(pattern)) {
      return res.status(400).json({ error: 'Sequences may only contain A, T, G, C' });
    }

    const text = dna.toUpperCase();
    const pat  = pattern.toUpperCase();

    const result = horspoolSearch(text, pat);
    const naive  = compare ? naiveSearch(text, pat) : null;

    if (req.user && req.user.id) {
      try {
        await Search.create({
          userId:        req.user.id,
          dna:           text,
          pattern:       pat,
          matches:       result.matches,
          comparisons:   result.comparisons,
          shifts:        result.shifts,
          skipped:       result.skippedComparisons,
          executionTime: result.executionTime,
        });
      } catch (_) { /* persistence is best-effort */ }
    }

    res.json({ result, naive });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
