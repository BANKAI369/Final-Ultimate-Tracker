import React, { useState } from 'react';
import api from '../lib/api';
import { Plus, Target, Calendar, TrendingUp, Filter, CheckCircle2, Circle, Flame, Trophy, Clock, BookOpen, Heart, Dumbbell, Brain } from 'lucide-react';

const Habits = () => {
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
    all: { icon: Target, label: 'All Habits', color: 'text-gray-600' },
    health: { icon: Heart, label: 'Health', color: 'text-red-500' },
    fitness: { icon: Dumbbell, label: 'Fitness', color: 'text-blue-500' },
    learning: { icon: BookOpen, label: 'Learning', color: 'text-green-500' },
    mindfulness: { icon: Brain, label: 'Mindfulness', color: 'text-purple-500' }
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completedToday;
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    }));
  };

  const addHabit = () => {
    if (newHabit.name.trim()) {
      const habit = {
        id: Date.now(),
        ...newHabit,
        streak: 0,
        bestStreak: 0,
        completedToday: false,
        weekProgress: [false, false, false, false, false, false, false]
      };
      setHabits([...habits, habit]);
      setNewHabit({ name: '', category: 'health', difficulty: 'medium', notes: '' });
      setShowAddModal(false);
    }
  };

  const filteredHabits = selectedCategory === 'all' 
    ? habits 
    : habits.filter(habit => habit.category === selectedCategory);

  const getCategoryStats = () => {
    const stats = {};
    Object.keys(categories).forEach(cat => {
      if (cat !== 'all') {
        const categoryHabits = habits.filter(h => h.category === cat);
        const completed = categoryHabits.filter(h => h.completedToday).length;
        stats[cat] = { total: categoryHabits.length, completed };
      }
    });
    return stats;
  };

  const handleAuthError = (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return true;
    }
    return false;
  };

  const deleteHabit = async (id) => {
    if (!window.confirm('Delete this habit?')) return;

    try {
      await api.delete(`/habits/${id}`);
      setHabits(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      if (handleAuthError(err)) return;
      alert('Failed to delete habit');
    }
  };
const saveEdit = async () => {
  try {
    const res = await api.put(`/habits/${editingHabit.id}`, editingHabit);
    setHabits(prev =>
      prev.map(h => h.id === editingHabit.id ? { ...res.data.habit, id: res.data.habit._id } : h)
    );
    setEditingHabit(null);
  } catch {
    alert('Failed to update habit');
  }
};



  const categoryStats = getCategoryStats();
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const streakLeaders = [...habits].sort((a, b) => b.streak - a.streak).slice(0, 3);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Habit Tracker</h1>
          <p className="text-gray-600">Build consistency, one day at a time</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Habit
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Progress</p>
              <p className="text-2xl font-bold text-gray-900">{completedToday}/{totalHabits}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Best Streak</p>
              <p className="text-2xl font-bold text-gray-900">{Math.max(...habits.map(h => h.bestStreak), 0)} days</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Streaks</p>
              <p className="text-2xl font-bold text-gray-900">{habits.filter(h => h.streak > 0).length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filter by Category</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(categories).map(([key, category]) => {
            const Icon = category.icon;
            const count = key === 'all' ? totalHabits : categoryStats[key]?.total || 0;
            const completed = key === 'all' ? completedToday : categoryStats[key]?.completed || 0;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  selectedCategory === key
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.label}</span>
                <span className="text-xs bg-white px-2 py-1 rounded-full">
                  {completed}/{count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredHabits.map(habit => {
          const CategoryIcon = categories[habit.category].icon;
          const weekCompletion = habit.weekProgress.filter(Boolean).length;
          
            return (
            <div key={habit.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                habit.completedToday ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                <CategoryIcon className={`w-5 h-5 ${
                  habit.completedToday ? 'text-green-600' : categories[habit.category].color
                }`} />
                </div>
                <div>
                <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[habit.difficulty]}`}>
                  {habit.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">{categories[habit.category].label}</span>
                </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                onClick={() => toggleHabit(habit.id)}
                className={`p-2 rounded-lg transition-colors ${
                  habit.completedToday
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                >
                {habit.completedToday ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
                <button
                onClick={() => deleteHabit(habit.id)}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                >
                ✕
                </button>
                <button
                  onClick={() => setEditingHabit(habit)}
                  className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                >
                  Edit
                </button>

              </div>
              </div>

              {/* Streak Info */}
              <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-900">{habit.streak} day streak</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Best: {habit.bestStreak}</span>
              </div>
              </div>

              {/* Week Progress */}
              <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">This Week</span>
                <span className="text-sm text-gray-600">{weekCompletion}/7 days</span>
              </div>
              <div className="flex gap-1">
                {habit.weekProgress.map((completed, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 rounded-full ${
                  completed ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                ></div>
                ))}
              </div>
              </div>

              {/* Notes */}
              {habit.notes && (
              <p className="text-sm text-gray-600 italic">{habit.notes}</p>
              )}
            </div>
            );
        })}
      </div>

      {/* Streak Leaders */}
      {streakLeaders.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Streak Leaders
          </h3>
          <div className="space-y-3">
            {streakLeaders.map((habit, index) => (
              <div key={habit.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{habit.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-gray-900">{habit.streak} days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Habit</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Habit Name</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Morning walk"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="health">Health</option>
                  <option value="fitness">Fitness</option>
                  <option value="learning">Learning</option>
                  <option value="mindfulness">Mindfulness</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={newHabit.difficulty}
                  onChange={(e) => setNewHabit({...newHabit, difficulty: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={newHabit.notes}
                  onChange={(e) => setNewHabit({...newHabit, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="3"
                  placeholder="Why is this habit important to you?"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addHabit}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}

      {editingHabit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="font-semibold mb-4">Edit Habit</h3>

            <input
              value={editingHabit.name}
              onChange={e => setEditingHabit({ ...editingHabit, name: e.target.value })}
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setEditingHabit(null)}
                className="flex-1 bg-gray-200 p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 bg-purple-600 text-white p-2 rounded"
              >
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