const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, default: 'general' },
    difficulty: { type: String, default: 'medium' },
    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    completedToday: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);
