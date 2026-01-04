import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Target,
  Award,
  Activity,
  DollarSign,
  CheckCircle2,
  Clock
} from 'lucide-react';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

import {
  BarChart, Bar
} from 'recharts';


const getWeeklyTrend = (habits) => {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return days.map((day, index) => {
    const completed = habits.filter(
      h => h.weekProgress?.[index]
    ).length;

    return { day, completed };
  });
};

const getCategoryStats = (habits) => {
  const map = {};

  habits.forEach(h => {
    if (!map[h.category]) {
      map[h.category] = { category: h.category, completed: 0, total: 0 };
    }
    map[h.category].total += 1;
    if (h.completedToday) map[h.category].completed += 1;
  });

  return Object.values(map);
};


const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30days');

  // Mock data for analytics
  const habitStats = {
    totalHabits: 5,
    completedToday: 3,
    weeklyAverage: 4.2,
    bestStreak: 12,
    currentStreak: 7,
    completionRate: 84
  };

  const moneyStats = {
    totalIncome: 2700,
    totalExpenses: 1245,
    savings: 1455,
    monthlyGrowth: 12.5,
    topCategory: 'Groceries',
    avgDailySpend: 41.5
  };

  const reminderStats = {
    totalReminders: 15,
    completed: 12,
    pending: 3,
    completionRate: 80,
    avgPerDay: 2.1,
    onTimeRate: 95
  };

  const periodStats = {
    avgCycleLength: 28,
    avgPeriodLength: 5,
    cycleVariation: 2,
    symptomsLogged: 8,
    currentPhase: 'Luteal',
    nextPeriod: 12
  };

  const weeklyHabits = [
    { day: 'Mon', completed: 4, total: 5 },
    { day: 'Tue', completed: 5, total: 5 },
    { day: 'Wed', completed: 3, total: 5 },
    { day: 'Thu', completed: 4, total: 5 },
    { day: 'Fri', completed: 5, total: 5 },
    { day: 'Sat', completed: 2, total: 5 },
    { day: 'Sun', completed: 4, total: 5 },
  ];

  const monthlyExpenses = [
    { category: 'Groceries', amount: 450, percentage: 36 },
    { category: 'Transportation', amount: 280, percentage: 22 },
    { category: 'Utilities', amount: 200, percentage: 16 },
    { category: 'Entertainment', amount: 180, percentage: 14 },
    { category: 'Healthcare', amount: 135, percentage: 12 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600 mt-1">Insights and trends from your tracking data.</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Habit Success Rate</p>
              <p className="text-3xl font-bold text-purple-600">{habitStats.completionRate}%</p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+5% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Monthly Savings</p>
              <p className="text-3xl font-bold text-green-600">${moneyStats.savings}</p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+{moneyStats.monthlyGrowth}% growth</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Task Completion</p>
              <p className="text-3xl font-bold text-orange-600">{reminderStats.completionRate}%</p>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-600">{reminderStats.onTimeRate}% on time</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Cycle Regularity</p>
              <p className="text-3xl font-bold text-pink-600">{periodStats.avgCycleLength} days</p>
              <div className="flex items-center space-x-1 mt-1">
                <Activity className="w-4 h-4 text-pink-500" />
                <span className="text-sm text-pink-600">±{periodStats.cycleVariation} day variation</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Habit Completion Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Weekly Habit Completion</h2>
              <BarChart3 className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {weeklyHabits.map((day, index) => {
                const percentage = (day.completed / day.total) * 100;
                return (
                  <div key={day.day} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">{day.day}</span>
                      <span className="text-sm text-slate-600">{day.completed}/{day.total}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Monthly Expense Breakdown</h2>
              <DollarSign className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {monthlyExpenses.map((expense, index) => {
                const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];
                return (
                  <div key={expense.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">{expense.category}</span>
                      <span className="text-sm text-slate-600">${expense.amount}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className={`${colors[index]} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${expense.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-500">{expense.percentage}% of total expenses</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Habits Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-slate-900">Habits</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Total Habits</span>
              <span className="font-semibold">{habitStats.totalHabits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Best Streak</span>
              <span className="font-semibold">{habitStats.bestStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Current Streak</span>
              <span className="font-semibold">{habitStats.currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Weekly Average</span>
              <span className="font-semibold">{habitStats.weeklyAverage}</span>
            </div>
          </div>
        </div>

        {/* Money Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-slate-900">Money</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Total Income</span>
              <span className="font-semibold">${moneyStats.totalIncome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Total Expenses</span>
              <span className="font-semibold">${moneyStats.totalExpenses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Top Category</span>
              <span className="font-semibold">{moneyStats.topCategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Avg Daily Spend</span>
              <span className="font-semibold">${moneyStats.avgDailySpend}</span>
            </div>
          </div>
        </div>

        {/* Reminders Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-slate-900">Reminders</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Total Reminders</span>
              <span className="font-semibold">{reminderStats.totalReminders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Completed</span>
              <span className="font-semibold">{reminderStats.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Pending</span>
              <span className="font-semibold">{reminderStats.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Avg Per Day</span>
              <span className="font-semibold">{reminderStats.avgPerDay}</span>
            </div>
          </div>
        </div>

        {/* Period Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold text-slate-900">Period</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Avg Cycle</span>
              <span className="font-semibold">{periodStats.avgCycleLength} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Avg Period</span>
              <span className="font-semibold">{periodStats.avgPeriodLength} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Current Phase</span>
              <span className="font-semibold">{periodStats.currentPhase}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Symptoms Logged</span>
              <span className="font-semibold">{periodStats.symptomsLogged}</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Completion Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getWeeklyTrend(habits)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} /> 
              <Tooltip />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#7c3aed"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getCategoryStats(habits)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="completed" fill="#22c55e" />
              <Bar dataKey="total" fill="#e5e7eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Longest Streak</p>
            <p className="text-2xl font-bold">
              {Math.max(...habits.map(h => h.bestStreak), 0)} days
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Active Streaks</p>
            <p className="text-2xl font-bold">
              {habits.filter(h => h.streak > 0).length}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Completion Rate Today</p>
            <p className="text-2xl font-bold">
              {habits.length
                ? Math.round(
                    (habits.filter(h => h.completedToday).length / habits.length) * 100
                  )
                : 0}%
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;