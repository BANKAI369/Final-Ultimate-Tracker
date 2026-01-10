const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    name: { type: String, required: true },
    category: { type: String, default: 'health' },
    difficulty: { type: String, default: 'medium' },
    notes: { type: String, default: '' },

    completedToday: { type: Boolean, default: false },

    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },

    weekProgress: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },

    // 👇 THIS IS THE IMPORTANT PART
    progress: {
      type: Map,
      of: [Boolean],
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);
