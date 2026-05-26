const mongoose = require('mongoose');

const mutationEntrySchema = new mongoose.Schema({
  position: Number,
  original: String,
  mutated:  String,
}, { _id: false });

const mutationSchema = new mongoose.Schema(
  {
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    original:   { type: String, required: true },
    mutated:    { type: String, required: true },
    mutations:  { type: [mutationEntrySchema], default: [] },
    similarity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mutation', mutationSchema);
