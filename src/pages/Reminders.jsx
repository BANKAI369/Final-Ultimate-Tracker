import React, { useState } from 'react';
import { Clock, Plus, CheckCircle2, Bell, Calendar, CreditCard as Edit3, Trash2, AlertCircle } from 'lucide-react';

const Reminders = () => {
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Team Meeting', description: 'Weekly team sync', time: '9:00 AM', date: 'Today', completed: false, priority: 'high' },
    { id: 2, title: 'Doctor Appointment', description: 'Annual checkup', time: '2:30 PM', date: 'Today', completed: false, priority: 'high' },
    { id: 3, title: 'Grocery Shopping', description: 'Buy weekly groceries', time: '6:00 PM', date: 'Today', completed: true, priority: 'medium' },
    { id: 4, title: 'Call Mom', description: 'Weekly check-in', time: '7:00 PM', date: 'Tomorrow', completed: false, priority: 'medium' },
    { id: 5, title: 'Pay Bills', description: 'Electricity and water', time: '10:00 AM', date: 'Tomorrow', completed: false, priority: 'high' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    time: '',
    date: '',
    priority: 'medium'
  });

  const toggleReminder = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const addReminder = () => {
    if (newReminder.title && newReminder.time && newReminder.date) {
      const reminder = {
        id: Date.now(),
        ...newReminder,
        completed: false
      };
      setReminders([...reminders, reminder]);
      setNewReminder({ title: '', description: '', time: '', date: '', priority: 'medium' });
      setShowAddForm(false);
    }
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const todayReminders = reminders.filter(r => r.date === 'Today');
  const tomorrowReminders = reminders.filter(r => r.date === 'Tomorrow');
  const completedToday = todayReminders.filter(r => r.completed).length;
  const pendingToday = todayReminders.filter(r => !r.completed).length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'low': return 'border-green-300 bg-green-50';
      default: return 'border-slate-300 bg-slate-50';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reminders</h1>
          <p className="text-slate-600 mt-1">Stay on top of your tasks and appointments.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending Today</p>
              <p className="text-3xl font-bold text-slate-900">{pendingToday}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Completed Today</p>
              <p className="text-3xl font-bold text-slate-900">{completedToday}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Reminders</p>
              <p className="text-3xl font-bold text-slate-900">{reminders.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Reminders */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Today's Reminders</h2>
        </div>
        <div className="p-6 space-y-4">
          {todayReminders.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No reminders for today</p>
            </div>
          ) : (
            todayReminders.map((reminder) => (
              <div key={reminder.id} className={`p-4 rounded-xl border-2 transition-all ${
                reminder.completed 
                  ? 'bg-green-50 border-green-200' 
                  : getPriorityColor(reminder.priority)
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => toggleReminder(reminder.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        reminder.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-slate-300 hover:border-green-400'
                      }`}
                    >
                      {reminder.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <h3 className={`font-semibold ${reminder.completed ? 'text-green-800 line-through' : 'text-slate-900'}`}>
                        {reminder.title}
                      </h3>
                      <p className="text-sm text-slate-600">{reminder.description}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-slate-500">{reminder.time}</span>
                        <div className="flex items-center space-x-1">
                          {getPriorityIcon(reminder.priority)}
                          <span className="text-xs text-slate-500 capitalize">{reminder.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
                      <Edit3 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button 
                      onClick={() => deleteReminder(reminder.id)}
                      className="w-8 h-8 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tomorrow's Reminders */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Tomorrow's Reminders</h2>
        </div>
        <div className="p-6 space-y-4">
          {tomorrowReminders.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>No reminders for tomorrow</p>
            </div>
          ) : (
            tomorrowReminders.map((reminder) => (
              <div key={reminder.id} className={`p-4 rounded-xl border-2 ${getPriorityColor(reminder.priority)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{reminder.title}</h3>
                      <p className="text-sm text-slate-600">{reminder.description}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-slate-500">{reminder.time}</span>
                        <div className="flex items-center space-x-1">
                          {getPriorityIcon(reminder.priority)}
                          <span className="text-xs text-slate-500 capitalize">{reminder.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="w-8 h-8 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
                      <Edit3 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button 
                      onClick={() => deleteReminder(reminder.id)}
                      className="w-8 h-8 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Add New Reminder</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Team Meeting"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Optional description"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <select
                    value={newReminder.date}
                    onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select date</option>
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <select
                  value={newReminder.priority}
                  onChange={(e) => setNewReminder({...newReminder, priority: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addReminder}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;