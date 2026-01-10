const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');

// =========================
// GET ALL HABITS
// =========================
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ habits });
  } catch (err) {
    console.error('Fetch habits error:', err);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
});

// =========================
// ADD HABIT
// =========================
router.post('/', auth, async (req, res) => {
  try {
    const habit = new Habit({
      userId: req.user.id,
      name: req.body.name,
      category: req.body.category,
      difficulty: req.body.difficulty,
      notes: req.body.notes || '',
      weekProgress: [false, false, false, false, false, false, false],
      monthProgress: Array(30).fill(false),
      completedToday: false,
      streak: 0,
      bestStreak: 0
    });

    await habit.save();
    res.status(201).json({ habit });
  } catch (err) {
    console.error('Add habit error:', err);
    res.status(500).json({ error: 'Failed to add habit' });
  }
});

// =========================
// UPDATE HABIT (EDIT)
// =========================
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        name: req.body.name,
        category: req.body.category,
        difficulty: req.body.difficulty,
        notes: req.body.notes
      },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ error: 'Habit not found or not authorized' });
    }

    res.json({ habit: updatedHabit });
  } catch (err) {
    console.error('Update habit error:', err);
    res.status(500).json({ error: 'Failed to update habit' });
  }
});

// =========================
// DELETE HABIT
// =========================
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Habit not found or not authorized' });
    }

    res.json({ message: 'Habit deleted successfully' });
  } catch (err) {
    console.error('Delete habit error:', err);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
});

// =========================
// TOGGLE TODAY (CARD VIEW)
// =========================
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const todayIndex = new Date().getDay(); // 0 = Sun, 6 = Sat

    habit.completedToday = !habit.completedToday;
    habit.weekProgress[todayIndex] = habit.completedToday;

    if (habit.completedToday) {
      habit.streak += 1;
      habit.bestStreak = Math.max(habit.bestStreak, habit.streak);
    } else {
      habit.streak = Math.max(0, habit.streak - 1);
    }

    await habit.save();
    res.json({ habit });
  } catch (err) {
    console.error('Toggle habit error:', err);
    res.status(500).json({ error: 'Failed to toggle habit' });
  }
});

// =========================
// UPDATE MONTH PROGRESS (EXCEL TABLE)
// =========================
router.patch('/:id/month-progress', auth, async (req, res) => {
  try {
    const { monthKey, dayIndex, value, daysInMonth } = req.body;

    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) return res.status(404).json({ error: 'Habit not found' });

    if (!habit.progress) habit.progress = new Map();

    // If this month not initialized yet → create correct length array
    if (!habit.progress.get(monthKey)) {
      habit.progress.set(monthKey, Array(daysInMonth).fill(false));
    }

    const monthArray = habit.progress.get(monthKey);
    monthArray[dayIndex] = value;

    habit.progress.set(monthKey, monthArray);
    habit.markModified('progress');

    await habit.save();
    res.json({ habit });
  } catch (err) {
    console.error('Month progress error:', err);
    res.status(500).json({ error: 'Failed to update month progress' });
  }
});


module.exports = router;
