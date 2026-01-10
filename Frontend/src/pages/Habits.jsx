import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import {
  Plus, Target, Filter, CheckCircle2, Circle,
  Flame, Trophy, BookOpen, Heart, Dumbbell, Brain
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const Habits = () => {

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  
  const [habits, setHabits] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'health',
    difficulty: 'medium',
    notes: ''
  });

  const categories = {
    all: { icon: Target, label: 'All' },
    health: { icon: Heart, label: 'Health' },
    fitness: { icon: Dumbbell, label: 'Fitness' },
    learning: { icon: BookOpen, label: 'Learning' },
    mindfulness: { icon: Brain, label: 'Mindfulness' }
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700'
  };

  // =========================
  // FETCH HABITS
  // =========================
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await api.get('/habits');
        const data = res.data.habits || res.data;

        const normalized = data.map(h => ({
          ...h,
          id: h._id,
          weekProgress: h.weekProgress || [false, false, false, false, false, false, false],
          monthProgress: h.monthProgress || Array(30).fill(false),
          completedToday: h.completedToday || false,
          streak: h.streak || 0,
          bestStreak: h.bestStreak || 0
        }));

        setHabits(normalized);
      } catch (err) {
        console.error('Fetch habits failed', err);
      }
    };

    fetchHabits();
  }, []);

  // =========================
  // TOGGLE TODAY
  // =========================
  const toggleHabit = async (id) => {
    setHabits(prev =>
      prev.map(habit => {
        if (habit.id !== id) return habit;

        const todayIndex = new Date().getDay();
        const newCompleted = !habit.completedToday;

        const newWeek = [...habit.weekProgress];
        newWeek[todayIndex] = newCompleted;

        return {
          ...habit,
          completedToday: newCompleted,
          weekProgress: newWeek,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1),
          bestStreak: newCompleted
            ? Math.max(habit.bestStreak, habit.streak + 1)
            : habit.bestStreak
        };
      })
    );

    try {
      await api.patch(`/habits/${id}/toggle`);
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };
  // =========================
  // ADD HABIT
  // =========================
  const addHabit = async () => {
    if (!newHabit.name.trim()) return;

    try {
      const res = await api.post('/habits', newHabit);
      const created = res.data.habit || res.data;

      setHabits(prev => [
        ...prev,
        {
          ...created,
          id: created._id,
          weekProgress: created.weekProgress || [false, false, false, false, false, false, false],
          monthProgress: created.monthProgress || Array(30).fill(false),
          completedToday: false,
          streak: 0,
          bestStreak: 0
        }
      ]);

      setNewHabit({ name: '', category: 'health', difficulty: 'medium', notes: '' });
      setShowAddModal(false);
    } catch (err) {
      console.error('Add habit failed', err);
    }
  };
  // =========================
  // DELETE
  // =========================
  const deleteHabit = async (id) => {
    if (!window.confirm('Delete this habit?')) return;

    try {
      await api.delete(`/habits/${id}`);
      setHabits(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete habit');
    }
  };
  // =========================
  // SAVE EDIT
  // =========================
  const saveEdit = async () => {
    try {
      const payload = {
        name: editingHabit.name,
        category: editingHabit.category,
        difficulty: editingHabit.difficulty,
        notes: editingHabit.notes
      };

      const res = await api.put(`/habits/${editingHabit.id}`, payload);
      const updated = res.data.habit;

      setHabits(prev =>
        prev.map(h =>
          h.id === editingHabit.id ? { ...h, ...updated, id: updated._id } : h
        )
      );

      setEditingHabit(null);
    } catch (err) {
      console.error('Edit failed', err);
      alert('Failed to update habit');
    }
  };
  // =========================
  // MONTH TABLE TOGGLE
  // =========================
  const toggleMonthProgress = async (habitId, dayIndex) => {
  setHabits(prev =>
    prev.map(habit => {
      if (habit.id !== habitId) return habit;

      const currentMonthArray =
        habit.progress?.[monthKey] || Array(daysInCurrentMonth).fill(false);

      const updated = [...currentMonthArray];
      updated[dayIndex] = !updated[dayIndex];

      return {
        ...habit,
        progress: {
          ...habit.progress,
          [monthKey]: updated
        }
      };
    })
  );

  try {
    await api.patch(`/habits/${habitId}/month-progress`, {
      monthKey,
      dayIndex,
      value: true,
      daysInMonth: daysInCurrentMonth
    });
  } catch (err) {
    console.error('Month update failed', err);
  }
};


  // =========================
  // FILTER
  // =========================
  const filteredHabits =
    selectedCategory === 'all'
      ? habits
      : habits.filter(h => h.category === selectedCategory);

  // =========================
  // GRAPH DATA
  // =========================
  const graphData = Array.from({ length: 30 }, (_, dayIndex) => {
    const completedCount = habits.filter(h => h.monthProgress?.[dayIndex]).length;
    return { day: dayIndex + 1, completed: completedCount };
  });
  // =========================
  // UI
  // =========================
  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} /> Add Habit
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mb-6">
        {Object.keys(categories).map(key => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-1 rounded ${
              selectedCategory === key ? 'bg-purple-600 text-white' : 'bg-gray-200'
            }`}
          >
            {categories[key].label}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {filteredHabits.map(habit => (
          <div key={habit.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{habit.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${difficultyColors[habit.difficulty]}`}>
                  {habit.difficulty}
                </span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => toggleHabit(habit.id)}>
                  {habit.completedToday ? (
                    <CheckCircle2 className="text-green-600" />
                  ) : (
                    <Circle />
                  )}
                </button>
                <button onClick={() => setEditingHabit(habit)}>Edit</button>
                <button onClick={() => deleteHabit(habit.id)}>✕</button>
              </div>
            </div>

            <div className="text-sm mt-2">
              🔥 {habit.streak} day streak | 🏆 Best: {habit.bestStreak}
            </div>

            <div className="flex gap-1 mt-2">
              {habit.weekProgress.map((done, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded ${done ? 'bg-green-400' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 30 DAY TABLE */}
      <div className="bg-white p-4 rounded shadow mb-10 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">30 Day Habit Sheet</h2>

        <table className="border-collapse min-w-full">
          <thead>
            <tr>
              <th className="border px-2 py-1">Habit</th>
              {Array.from({ length: daysInCurrentMonth }, (_, i) => (
                <th key={i} className="border px-1 text-xs">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map(habit => (
              <tr key={habit.id}>
                <td className="border px-2 py-1 font-medium">{habit.name}</td>
                {(habit.progress?.[monthKey] || Array(daysInCurrentMonth).fill(false)).map((done, index) => (
                  <td key={index} className="border text-center">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleMonthProgress(habit.id, index)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GRAPH */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">30 Day Completion Trend</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="completed" stroke="#7c3aed" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-semibold mb-3">Add Habit</h3>

            <input
              className="w-full border p-2 mb-2"
              placeholder="Habit name"
              value={newHabit.name}
              onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
            />

            <select
              className="w-full border p-2 mb-2"
              value={newHabit.category}
              onChange={e => setNewHabit({ ...newHabit, category: e.target.value })}
            >
              <option value="health">Health</option>
              <option value="fitness">Fitness</option>
              <option value="learning">Learning</option>
              <option value="mindfulness">Mindfulness</option>
            </select>

            <select
              className="w-full border p-2 mb-2"
              value={newHabit.difficulty}
              onChange={e => setNewHabit({ ...newHabit, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <textarea
              className="w-full border p-2 mb-3"
              placeholder="Notes"
              value={newHabit.notes}
              onChange={e => setNewHabit({ ...newHabit, notes: e.target.value })}
            />

            <div className="flex gap-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 p-2 rounded">
                Cancel
              </button>
              <button onClick={addHabit} className="flex-1 bg-purple-600 text-white p-2 rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingHabit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-semibold mb-3">Edit Habit</h3>

            <input
              className="w-full border p-2 mb-2"
              value={editingHabit.name}
              onChange={e => setEditingHabit({ ...editingHabit, name: e.target.value })}
            />

            <select
              className="w-full border p-2 mb-2"
              value={editingHabit.category}
              onChange={e => setEditingHabit({ ...editingHabit, category: e.target.value })}
            >
              <option value="health">Health</option>
              <option value="fitness">Fitness</option>
              <option value="learning">Learning</option>
              <option value="mindfulness">Mindfulness</option>
            </select>

            <select
              className="w-full border p-2 mb-2"
              value={editingHabit.difficulty}
              onChange={e => setEditingHabit({ ...editingHabit, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <textarea
              className="w-full border p-2 mb-3"
              value={editingHabit.notes || ''}
              onChange={e => setEditingHabit({ ...editingHabit, notes: e.target.value })}
            />

            <div className="flex gap-2">
              <button onClick={() => setEditingHabit(null)} className="flex-1 bg-gray-200 p-2 rounded">
                Cancel
              </button>
              <button onClick={saveEdit} className="flex-1 bg-purple-600 text-white p-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Habits;
