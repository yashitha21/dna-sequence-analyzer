const Search   = require('../models/Search');
const Mutation = require('../models/Mutation');

exports.history = async (req, res) => {
  try {
    if (!req.user) return res.json({ searches: [], mutations: [] });
    const [searches, mutations] = await Promise.all([
      Search.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50).lean(),
      Mutation.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50).lean(),
    ]);
    res.json({ searches, mutations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.analytics = async (req, res) => {
  try {
    const userFilter = req.user ? { userId: req.user.id } : {};

    const [totalSearches, totalMutations, avgTimeAgg, topPatterns] = await Promise.all([
      Search.countDocuments(userFilter),
      Mutation.countDocuments(userFilter),
      Search.aggregate([
        { $match: userFilter },
        { $group: { _id: null, avg: { $avg: '$executionTime' } } },
      ]),
      Search.aggregate([
        { $match: userFilter },
        { $group: { _id: '$pattern', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, pattern: '$_id', count: 1 } },
      ]),
    ]);

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyAgg = await Search.aggregate([
      { $match: { ...userFilter, createdAt: { $gte: since } } },
      { $group: {
          _id: { day: { $dayOfWeek: '$createdAt' } },
          searches: { $sum: 1 },
      } },
      { $sort: { '_id.day': 1 } },
    ]);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daily = dailyAgg.map(d => ({ day: dayNames[d._id.day - 1], searches: d.searches, mutations: 0 }));

    res.json({
      totals: {
        searches: totalSearches,
        mutations: totalMutations,
        patterns: topPatterns.length,
        avgTime: +(avgTimeAgg[0]?.avg || 0).toFixed(3),
      },
      daily,
      topPatterns,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
