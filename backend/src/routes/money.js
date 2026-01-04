const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');

const router = express.Router();

// GET /api/money - return all money data for user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    const budgets = await Budget.find({ user: req.user.id });
    const goals = await Goal.find({ user: req.user.id });

    res.json({ transactions, budgets, goals });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/money/transactions
router.post('/transactions', auth, async (req, res) => {
  try {
    const { type, amount, category, description, date, account, recurring } = req.body;
    if (!type || amount == null || !category || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      description,
      date,
      account,
      recurring
    });

    // If expense, try to update budget spent for that category
    if (type === 'expense') {
      const budget = await Budget.findOne({ user: req.user.id, category });
      if (budget) {
        budget.spent = (budget.spent || 0) + Number(amount);
        await budget.save();
      }
    }

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/money/transactions/:id
router.delete('/transactions/:id', auth, async (req, res) => {
  try {
    const t = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!t) return res.status(404).json({ message: 'Transaction not found' });

    // if expense, reduce budget spent
    if (t.type === 'expense') {
      const budget = await Budget.findOne({ user: req.user.id, category: t.category });
      if (budget) {
        budget.spent = Math.max(0, (budget.spent || 0) - t.amount);
        await budget.save();
      }
    }

    await t.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/money/budgets
router.post('/budgets', auth, async (req, res) => {
  try {
    const { category, limit, period } = req.body;
    if (!category || limit == null) return res.status(400).json({ message: 'Missing fields' });

    const budget = await Budget.create({ user: req.user.id, category, limit, period });
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/money/goals
router.post('/goals', auth, async (req, res) => {
  try {
    const { name, target, deadline, priority } = req.body;
    if (!name || target == null) return res.status(400).json({ message: 'Missing fields' });

    const goal = await Goal.create({ user: req.user.id, name, target, deadline, priority });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
