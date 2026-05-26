const { detectMutations, calculateSimilarity, validateDNA } = require('../utils/horspool');

exports.compare = (req, res) => {
  const { a, b } = req.body;
  if (!a || !b) return res.status(400).json({ error: 'Both sequences a and b are required' });
  if (!validateDNA(a) || !validateDNA(b)) {
    return res.status(400).json({ error: 'Sequences may only contain A, T, G, C' });
  }
  const A = a.toUpperCase();
  const B = b.toUpperCase();
  res.json({
    similarity: calculateSimilarity(A, B),
    differences: detectMutations(A, B),
    lengths: { a: A.length, b: B.length },
  });
};
