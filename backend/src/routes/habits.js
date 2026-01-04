const express = require('express');
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');

const router = express.Router();

// all routes below require auth
router.use(auth);

// GET /api/habits
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/habits
router.post('/', async (req, res) => {
  try {
    const habit = await Habit.create({
      userId: req.userId,
      ...req.body,
    });
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// PUT /api/habits/:id
router.put('/:id', async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    res.json(habit);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err.message });
  }
});

// DELETE /api/habits/:id
// DELETE habit
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ success: true, id: habit._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete habit' });
  }
});
// UPDATE habit
router.put('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ habit });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update habit' });
  }
});



module.exports = router;
