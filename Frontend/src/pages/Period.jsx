import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Plus, 
  TrendingUp, 
  Droplets, 
  Moon, 
  Sun, 
  Activity, 
  AlertCircle, 
  CreditCard as Edit3,
  Thermometer,
  Brain,
  Zap,
  Shield,
  Star,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';

const Period = () => {
  const [cycleData, setCycleData] = useState({
    lastPeriod: '',
    cycleLength: 28,
    periodLength: 5,
    currentDay: 0,
    cycles: []
  });

  const [symptoms, setSymptoms] = useState([]);

  const [dailyLogs, setDailyLogs] = useState([]);

  const [predictions, setPredictions] = useState({
    nextPeriod: { date: '2024-01-29', confidence: 85 },
    ovulation: { date: '2024-01-15', confidence: 78 },
    fertileWindow: { start: '2024-01-10', end: '2024-01-17' },
    pmsStart: { date: '2024-01-25', confidence: 72 }
  });

  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [showDailyLogForm, setShowDailyLogForm] = useState(false);
  const [newSymptom, setNewSymptom] = useState({ 
    name: '', 
    severity: 'mild', 
    date: new Date().toISOString().split('T')[0],
    category: 'physical',
    notes: ''
  });
  const [newDailyLog, setNewDailyLog] = useState({
    date: new Date().toISOString().split('T')[0],
    flow: 'none',
    mood: 5,
    energy: 5,
    pain: 1,
    temperature: '',
    notes: ''
  });

  const addSymptom = () => {
    if (newSymptom.name) {
      const symptom = {
        id: Date.now(),
        ...newSymptom
      };
      setSymptoms([symptom, ...symptoms]);
      setNewSymptom({ 
        name: '', 
        severity: 'mild', 
        date: new Date().toISOString().split('T')[0],
        category: 'physical',
        notes: ''
      });
      setShowSymptomForm(false);
    }
  };

  const addDailyLog = () => {
    const log = {
      ...newDailyLog,
      temperature: parseFloat(newDailyLog.temperature) || null
    };
    setDailyLogs([log, ...dailyLogs]);
    setNewDailyLog({
      date: new Date().toISOString().split('T')[0],
      flow: 'none',
      mood: 5,
      energy: 5,
      pain: 1,
      temperature: '',
      notes: ''
    });
    setShowDailyLogForm(false);
  };

  const getCurrentPhase = () => {
    const { currentDay, cycleLength } = cycleData;
    if (currentDay <= 5) return { 
      phase: 'Menstrual', 
      color: 'bg-red-500', 
      icon: Droplets,
      description: 'Your period is here. Focus on rest and self-care.',
      tips: ['Stay hydrated', 'Use heat therapy for cramps', 'Get adequate rest']
    };
    if (currentDay <= 13) return { 
      phase: 'Follicular', 
      color: 'bg-green-500', 
      icon: Sun,
      description: 'Energy levels rising. Great time for new projects.',
      tips: ['Try new workouts', 'Plan important meetings', 'Focus on learning']
    };
    if (currentDay <= 15) return { 
      phase: 'Ovulation', 
      color: 'bg-yellow-500', 
      icon: Activity,
      description: 'Peak fertility window. High energy and confidence.',
      tips: ['Social activities', 'Important conversations', 'Creative projects']
    };
    return { 
      phase: 'Luteal', 
      color: 'bg-purple-500', 
      icon: Moon,
      description: 'Winding down phase. Time for reflection and planning.',
      tips: ['Organize and plan', 'Gentle exercise', 'Prepare for next cycle']
    };
  };

  const getNextPeriod = () => {
    const daysUntilNext = cycleData.cycleLength - cycleData.currentDay;
    return daysUntilNext;
  };

  const getFertileWindow = () => {
    const ovulationDay = Math.floor(cycleData.cycleLength / 2);
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;
    const { currentDay } = cycleData;
    
    if (currentDay >= fertileStart && currentDay <= fertileEnd) {
      return { status: 'High fertility', color: 'text-green-600', icon: '🟢' };
    } else if (currentDay >= fertileStart - 2 && currentDay <= fertileEnd + 2) {
      return { status: 'Medium fertility', color: 'text-yellow-600', icon: '🟡' };
    }
    return { status: 'Low fertility', color: 'text-slate-600', icon: '⚪' };
  };

  const currentPhase = getCurrentPhase();
  const PhaseIcon = currentPhase.icon;
  const nextPeriod = getNextPeriod();
  const fertility = getFertileWindow();

  const symptomTypes = {
    physical: ['Cramps', 'Bloating', 'Headache', 'Fatigue', 'Breast Tenderness', 'Back Pain', 'Nausea', 'Acne'],
    emotional: ['Mood Swings', 'Anxiety', 'Depression', 'Irritability', 'Emotional Sensitivity'],
    other: ['Food Cravings', 'Sleep Issues', 'Hot Flashes', 'Dizziness', 'Constipation']
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'severe': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'physical': return <Zap className="w-4 h-4" />;
      case 'emotional': return <Brain className="w-4 h-4" />;
      case 'other': return <Star className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getFlowColor = (flow) => {
    switch (flow) {
      case 'heavy': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'light': return 'bg-yellow-500';
      case 'spotting': return 'bg-pink-500';
      default: return 'bg-slate-300';
    }
  };

  const averageCycleLength = cycleData.cycles.reduce((sum, cycle) => sum + cycle.length, 0) / cycleData.cycles.length;
  const cycleVariation = Math.max(...cycleData.cycles.map(c => c.length)) - Math.min(...cycleData.cycles.map(c => c.length));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Period Tracker</h1>
          <p className="text-slate-600 mt-1">Advanced cycle tracking with AI-powered insights and predictions.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowDailyLogForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Daily Log</span>
          </button>
          <button 
            onClick={() => setShowSymptomForm(true)}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Log Symptom</span>
          </button>
        </div>
      </div>

      {/* Cycle Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Current Phase</p>
              <p className="text-2xl font-bold text-slate-900">{currentPhase.phase}</p>
              <p className="text-xs text-slate-500 mt-1">Day {cycleData.currentDay} of {cycleData.cycleLength}</p>
            </div>
            <div className={`w-12 h-12 ${currentPhase.color} bg-opacity-20 rounded-xl flex items-center justify-center`}>
              <PhaseIcon className={`w-6 h-6 ${currentPhase.color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Next Period</p>
              <p className="text-2xl font-bold text-slate-900">{nextPeriod} days</p>
              <p className="text-xs text-slate-500 mt-1">{predictions.nextPeriod.confidence}% confidence</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Fertility Status</p>
              <p className="text-lg font-bold text-slate-900">{fertility.status}</p>
              <p className="text-xs text-slate-500 mt-1">Ovulation in 2 days</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Cycle Regularity</p>
              <p className="text-2xl font-bold text-slate-900">{averageCycleLength.toFixed(0)} days</p>
              <p className="text-xs text-slate-500 mt-1">±{cycleVariation} day variation</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cycle Visualization */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Cycle Progress & Insights</h2>
              <BarChart3 className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(cycleData.currentDay / cycleData.cycleLength) * 283} 283`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900">Day {cycleData.currentDay}</div>
                      <div className="text-sm text-slate-600">of {cycleData.cycleLength}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">{currentPhase.phase} Phase</h3>
                <p className="text-sm text-purple-700 mb-3">{currentPhase.description}</p>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-purple-800">Recommended activities:</p>
                  {currentPhase.tips.map((tip, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-purple-700">
                      <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-xs text-red-700 font-medium">Period</span>
                  <div className="text-xs text-red-600 mt-1">Days 1-5</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-xs text-green-700 font-medium">Follicular</span>
                  <div className="text-xs text-green-600 mt-1">Days 6-13</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-xs text-yellow-700 font-medium">Ovulation</span>
                  <div className="text-xs text-yellow-600 mt-1">Days 14-15</div>
                </div>
                <div className={`text-center p-3 rounded-lg border-2 ${
                  currentPhase.phase === 'Luteal' ? 'bg-purple-50 border-purple-300' : 'bg-purple-50 border-purple-200'
                }`}>
                  <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-2"></div>
                  <span className="text-xs text-purple-700 font-medium">Luteal</span>
                  <div className="text-xs text-purple-600 mt-1">Days 16-28</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Predictions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900">AI Predictions</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="p-4 bg-pink-50 rounded-xl border border-pink-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-pink-900">Next Period</span>
                <span className="text-xs bg-pink-200 text-pink-800 px-2 py-1 rounded-full">
                  {predictions.nextPeriod.confidence}% sure
                </span>
              </div>
              <p className="text-sm text-pink-700">{predictions.nextPeriod.date}</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-green-900">Ovulation</span>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                  {predictions.ovulation.confidence}% sure
                </span>
              </div>
              <p className="text-sm text-green-700">{predictions.ovulation.date}</p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-yellow-900">Fertile Window</span>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                  High accuracy
                </span>
              </div>
              <p className="text-sm text-yellow-700">
                {predictions.fertileWindow.start} - {predictions.fertileWindow.end}
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-purple-900">PMS Start</span>
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                  {predictions.pmsStart.confidence}% sure
                </span>
              </div>
              <p className="text-sm text-purple-700">{predictions.pmsStart.date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Symptoms & Daily Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Symptoms */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">Recent Symptoms</h2>
          </div>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {symptoms.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No symptoms logged yet</p>
              </div>
            ) : (
              symptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center space-x-2 mt-1">
                      {getCategoryIcon(symptom.category)}
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{symptom.name}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(symptom.severity)}`}>
                          {symptom.severity}
                        </span>
                        <span className="text-sm text-slate-500">{symptom.date}</span>
                      </div>
                      {symptom.notes && (
                        <p className="text-sm text-slate-600 mt-2">{symptom.notes}</p>
                      )}
                    </div>
                  </div>
                  <button className="w-8 h-8 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
                    <Edit3 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Daily Logs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">Daily Logs</h2>
          </div>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {dailyLogs.map((log, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-slate-900">{log.date}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getFlowColor(log.flow)}`}></div>
                    <span className="text-sm text-slate-600 capitalize">{log.flow}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Mood</div>
                    <div className="font-semibold text-slate-900">{log.mood}/10</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Energy</div>
                    <div className="font-semibold text-slate-900">{log.energy}/10</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500">Pain</div>
                    <div className="font-semibold text-slate-900">{log.pain}/10</div>
                  </div>
                </div>
                {log.temperature && (
                  <div className="mt-2 flex items-center space-x-2 text-sm">
                    <Thermometer className="w-4 h-4 text-blue-500" />
                    <span className="text-slate-600">{log.temperature}°F</span>
                  </div>
                )}
                {log.notes && (
                  <p className="text-sm text-slate-600 mt-2 italic">"{log.notes}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cycle History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Cycle History & Settings</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Recent Cycles</h3>
              <div className="space-y-3">
                {cycleData.cycles.map((cycle) => (
                  <div key={cycle.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <span className="font-medium text-slate-900">{cycle.startDate}</span>
                      <div className="text-sm text-slate-600">
                        {cycle.length} days • {cycle.flow} flow
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getFlowColor(cycle.flow)}`}></div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Cycle Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Average Cycle Length</label>
                  <input
                    type="number"
                    value={cycleData.cycleLength}
                    onChange={(e) => setCycleData({...cycleData, cycleLength: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    min="21"
                    max="35"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Average Period Length</label>
                  <input
                    type="number"
                    value={cycleData.periodLength}
                    onChange={(e) => setCycleData({...cycleData, periodLength: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    min="3"
                    max="7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Period Start</label>
                  <input
                    type="date"
                    value={cycleData.lastPeriod}
                    onChange={(e) => setCycleData({...cycleData, lastPeriod: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Symptom Modal */}
      {showSymptomForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Log Symptom</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={newSymptom.category}
                  onChange={(e) => setNewSymptom({...newSymptom, category: e.target.value, name: ''})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="physical">Physical</option>
                  <option value="emotional">Emotional</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Symptom</label>
                <select
                  value={newSymptom.name}
                  onChange={(e) => setNewSymptom({...newSymptom, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select symptom</option>
                  {symptomTypes[newSymptom.category].map(symptom => (
                    <option key={symptom} value={symptom}>{symptom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Severity</label>
                <div className="flex space-x-4">
                  {['mild', 'moderate', 'severe'].map(severity => (
                    <button
                      key={severity}
                      onClick={() => setNewSymptom({...newSymptom, severity})}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors capitalize ${
                        newSymptom.severity === severity
                          ? severity === 'mild' ? 'bg-green-500 text-white' :
                            severity === 'moderate' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newSymptom.date}
                  onChange={(e) => setNewSymptom({...newSymptom, date: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes (optional)</label>
                <textarea
                  value={newSymptom.notes}
                  onChange={(e) => setNewSymptom({...newSymptom, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows="3"
                  placeholder="Additional details..."
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowSymptomForm(false)}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addSymptom}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Log Symptom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Daily Log Modal */}
      {showDailyLogForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Daily Log</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newDailyLog.date}
                  onChange={(e) => setNewDailyLog({...newDailyLog, date: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Flow</label>
                <select
                  value={newDailyLog.flow}
                  onChange={(e) => setNewDailyLog({...newDailyLog, flow: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="none">None</option>
                  <option value="spotting">Spotting</option>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mood (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newDailyLog.mood}
                    onChange={(e) => setNewDailyLog({...newDailyLog, mood: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-slate-600">{newDailyLog.mood}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Energy (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newDailyLog.energy}
                    onChange={(e) => setNewDailyLog({...newDailyLog, energy: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-slate-600">{newDailyLog.energy}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pain (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newDailyLog.pain}
                    onChange={(e) => setNewDailyLog({...newDailyLog, pain: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-slate-600">{newDailyLog.pain}</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Temperature (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newDailyLog.temperature}
                  onChange={(e) => setNewDailyLog({...newDailyLog, temperature: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="98.6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={newDailyLog.notes}
                  onChange={(e) => setNewDailyLog({...newDailyLog, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows="3"
                  placeholder="How are you feeling today?"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowDailyLogForm(false)}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addDailyLog}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Period;