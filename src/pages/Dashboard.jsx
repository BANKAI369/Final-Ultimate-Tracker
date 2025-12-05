import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Heart, 
  CheckCircle2, 
  Plus, 
  TrendingUp, 
  Clock, 
  Zap,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [habits] = useState([
    { id: 1, name: 'Drink Water', streak: 7, completed: true, color: 'bg-blue-500' },
    { id: 2, name: 'Exercise', streak: 3, completed: false, color: 'bg-green-500' },
    { id: 3, name: 'Read Books', streak: 12, completed: true, color: 'bg-purple-500' },
  ]);

  const [reminders] = useState([
    { id: 1, title: 'Team Meeting', time: '9:00 AM', completed: false },
    { id: 2, title: 'Doctor Appointment', time: '2:30 PM', completed: false },
  ]);

  const [transactions] = useState([
    { id: 1, type: 'income', amount: 2500, category: 'Salary', date: 'Today' },
    { id: 2, type: 'expense', amount: 45, category: 'Groceries', date: 'Today' },
  ]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const completedHabits = habits.filter(h => h.completed).length;
  const pendingReminders = reminders.filter(r => !r.completed).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's your daily overview.</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-slate-600">
          <span className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>{completedHabits}/3 habits</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>{pendingReminders} pending</span>
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Habits Completed</p>
              <p className="text-2xl font-bold text-slate-900">{completedHabits}/3</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{pendingReminders}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Balance</p>
              <p className="text-2xl font-bold text-slate-900">${balance.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Next Period</p>
              <p className="text-2xl font-bold text-slate-900">12 days</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Habits Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Today's Habits</h2>
              <Link to="/habits" className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${habit.color}`}></div>
                  <span className="font-medium text-slate-900">{habit.name}</span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  habit.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-slate-300'
                }`}>
                  {habit.completed && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Upcoming Reminders</h2>
              <Link to="/reminders" className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-sm font-medium">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-medium text-slate-900">{reminder.title}</span>
                  <div className="text-sm text-slate-500">{reminder.time}</div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-orange-300"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;