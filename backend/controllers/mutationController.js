const Mutation = require('../models/Mutation');
const { detectMutations, calculateSimilarity, validateDNA } = require('../utils/horspool');

exports.detect = async (req, res) => {
  try {
    const { original, mutated } = req.body;
    if (!original || !mutated) return res.status(400).json({ error: 'original and mutated sequences are required' });
    if (!validateDNA(original) || !validateDNA(mutated)) {
      return res.status(400).json({ error: 'Sequences may only contain A, T, G, C' });
    }

    const o = original.toUpperCase();
    const m = mutated.toUpperCase();
    const mutations  = detectMutations(o, m);
    const similarity = calculateSimilarity(o, m);

    if (req.user && req.user.id) {
      try { await Mutation.create({ userId: req.user.id, original: o, mutated: m, mutations, similarity }); }
      catch (_) {}
    }

    res.json({ mutations, similarity, count: mutations.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
