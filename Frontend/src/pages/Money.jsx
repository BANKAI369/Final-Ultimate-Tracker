import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  PieChart, 
  Calendar, 
  CreditCard as Edit3, 
  Trash2,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import api from '../lib/api';

const Money = () => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('moneyData');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.transactions || [];
    } catch (e) {
      return [];
    }
  });

  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem('moneyData');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.budgets || [];
    } catch (e) {
      return [];
    }
  });

  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('moneyData');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.goals || [];
    } catch (e) {
      return [];
    }
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    account: 'Checking',
    recurring: false
  });

  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    period: 'monthly'
  });

  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    deadline: '',
    priority: 'medium'
  });

  const addTransaction = async () => {
    if (newTransaction.amount && newTransaction.category) {
      const localTx = {
        id: Date.now(),
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      };

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = { ...newTransaction, amount: parseFloat(newTransaction.amount) };
          const res = await api.post('/money/transactions', payload);
          // server returns the created transaction
          setTransactions([res.data, ...transactions]);
        } catch (err) {
          // fallback to local-only transaction
          setTransactions([localTx, ...transactions]);
        }
      } else {
        setTransactions([localTx, ...transactions]);
      }

      setNewTransaction({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        account: 'Checking',
        recurring: false
      });
      setShowAddForm(false);
    }
  }; 

  const addBudget = async () => {
    if (newBudget.category && newBudget.limit) {
      const localBudget = {
        id: Date.now(),
        ...newBudget,
        limit: parseFloat(newBudget.limit),
        spent: 0
      };

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.post('/money/budgets', { category: newBudget.category, limit: parseFloat(newBudget.limit), period: newBudget.period });
          setBudgets([...budgets, res.data]);
        } catch (err) {
          setBudgets([...budgets, localBudget]);
        }
      } else {
        setBudgets([...budgets, localBudget]);
      }

      setNewBudget({ category: '', limit: '', period: 'monthly' });
      setShowBudgetForm(false);
    }
  }; 

  const addGoal = async () => {
    if (newGoal.name && newGoal.target) {
      const localGoal = {
        id: Date.now(),
        ...newGoal,
        target: parseFloat(newGoal.target),
        current: 0
      };

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.post('/money/goals', { name: newGoal.name, target: parseFloat(newGoal.target), deadline: newGoal.deadline, priority: newGoal.priority });
          setGoals([...goals, res.data]);
        } catch (err) {
          setGoals([...goals, localGoal]);
        }
      } else {
        setGoals([...goals, localGoal]);
      }

      setNewGoal({ name: '', target: '', deadline: '', priority: 'medium' });
      setShowGoalForm(false);
    }
  }; 
  const deleteTransaction = async (id) => {
    const tx = transactions.find(t => (t._id && t._id === id) || (t.id && t.id === id));
    if (!tx) return;

    const token = localStorage.getItem('token');
    if (token && tx._id) {
      try {
        await api.delete(`/money/transactions/${tx._id}`);
      } catch (err) {
        // ignore errors, proceed to remove locally
      }
    }

    setTransactions(transactions.filter(t => (t._id && t._id !== id) || (t.id && t.id !== id)));
  }; 

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

  // Category breakdown
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topCategories = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  // Budget analysis
  const budgetAlerts = budgets.filter(b => (b.spent / b.limit) > 0.8);
  const totalBudgetUsed = budgets.reduce((sum, b) => sum + (b.spent / b.limit * 100), 0) / budgets.length;

  // Goal progress
  const totalGoalProgress = goals.reduce((sum, g) => sum + (g.current / g.target * 100), 0) / goals.length;
  const categories = [
    'Groceries', 'Utilities', 'Transportation', 'Food', 'Entertainment',
    'Healthcare', 'Shopping', 'Education', 'Travel', 'Housing', 'Investment', 'Other'
  ];

  const accounts = ['Checking', 'Savings', 'Credit Card', 'Cash'];

  const getBudgetStatus = (budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return { status: 'over', color: 'text-red-600', bg: 'bg-red-100' };
    if (percentage >= 80) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const getGoalPriority = (priority) => {
    switch (priority) {
      case 'high': return { color: 'text-red-600', bg: 'bg-red-100' };
      case 'medium': return { color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'low': return { color: 'text-green-600', bg: 'bg-green-100' };
      default: return { color: 'text-slate-600', bg: 'bg-slate-100' };
    }
  };

  const moneyData = { transactions, budgets, goals };

  useEffect(() => {
    localStorage.setItem('moneyData', JSON.stringify(moneyData));
  }, [moneyData]);



  // If the user is authenticated, sync local data to server and prefer server data
  useEffect(() => {
    const syncWithServer = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // First try to upload any local-only items
        const local = JSON.parse(localStorage.getItem('moneyData') || '{}');
        const localTx = (local.transactions || []).filter(t => !t._id);
        const localBud = (local.budgets || []).filter(b => !b._id);
        const localGoals = (local.goals || []).filter(g => !g._id);

        for (const t of localTx) {
          try { await api.post('/money/transactions', { ...t, amount: t.amount, date: t.date }); } catch (e) { }
        }
        for (const b of localBud) {
          try { await api.post('/money/budgets', { category: b.category, limit: b.limit, period: b.period }); } catch (e) { }
        }
        for (const g of localGoals) {
          try { await api.post('/money/goals', { name: g.name, target: g.target, deadline: g.deadline, priority: g.priority }); } catch (e) { }
        }

        // Fetch authoritative server data
        const res = await api.get('/money');
        if (res && res.data) {
          setTransactions(res.data.transactions || []);
          setBudgets(res.data.budgets || []);
          setGoals(res.data.goals || []);
        }
      } catch (err) {
        // network or server error — keep local data
      }
    };

    syncWithServer();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Money Tracker</h1>
          <p className="text-slate-600 mt-1">Advanced financial tracking with budgets, goals, and insights.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowBudgetForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Target className="w-5 h-5" />
            <span>Add Budget</span>
          </button>
          <button 
            onClick={() => setShowGoalForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Target className="w-5 h-5" />
            <span>Add Goal</span>
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Balance</p>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{balance.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Income</p>
              <p className="text-3xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Savings Rate</p>
              <p className={`text-3xl font-bold ${savingsRate >= 20 ? 'text-green-600' : savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                {savingsRate.toFixed(0)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Budget Overview</h2>
            <div className="flex items-center space-x-2">
              {budgetAlerts.length > 0 && (
                <span className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{budgetAlerts.length} alerts</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => {
              const status = getBudgetStatus(budget);
              const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
              return (
                <div key={budget._id || budget.id} className={`p-4 rounded-xl border-2 ${status.bg} ${status.bg.replace('bg-', 'border-').replace('100', '200')}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-900">{budget.category}</span>
                    <span className={`text-sm font-medium ${status.color}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>₹{budget.spent}</span>
                      <span>₹{budget.limit}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          percentage >= 100 ? 'bg-red-500' : 
                          percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial Goals */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-900">Financial Goals</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              const priority = getGoalPriority(goal.priority);
              return (
                <div key={goal._id || goal.id} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-slate-900">{goal.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color}`}>
                      {goal.priority}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>₹{goal.current.toLocaleString()}</span>
                      <span>₹{goal.target.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{progress.toFixed(0)}% complete</span>
                      <span>Due: {goal.deadline}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Recent Transactions</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expenses</option>
                </select>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {filteredTransactions.map((transaction) => (
              <div key={transaction._id || transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-slate-900">{transaction.category}</h3>
                      {transaction.recurring && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Recurring</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{transaction.description}</p>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <span>{transaction.account}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button className="w-8 h-8 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
                      <Edit3 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button 
                      onClick={() => deleteTransaction(transaction._id || transaction.id)}
                      className="w-8 h-8 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-slate-600" />
              <h2 className="text-xl font-semibold text-slate-900">Top Categories</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {topCategories.map(([category, amount], index) => {
              const percentage = (amount / totalExpenses) * 100;
              const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900">{category}</span>
                    <span className="text-sm text-slate-600">₹{amount}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${colors[index % colors.length]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-500">{percentage.toFixed(1)}% of expenses</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Add Transaction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'income'})}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                      newTransaction.type === 'income'
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                      newTransaction.type === 'expense'
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Optional description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Account</label>
                  <select
                    value={newTransaction.account}
                    onChange={(e) => setNewTransaction({...newTransaction, account: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {accounts.map(account => (
                      <option key={account} value={account}>{account}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={newTransaction.recurring}
                  onChange={(e) => setNewTransaction({...newTransaction, recurring: e.target.checked})}
                  className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                />
                <label htmlFor="recurring" className="text-sm text-slate-700">Recurring transaction</label>
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
                onClick={addTransaction}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Add Budget</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Budget Limit</label>
                <input
                  type="number"
                  step="0.01"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget({...newBudget, limit: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Period</label>
                <select
                  value={newBudget.period}
                  onChange={(e) => setNewBudget({...newBudget, period: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowBudgetForm(false)}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addBudget}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Add Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Add Financial Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="10000.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Date</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowGoalForm(false)}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addGoal}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Money;