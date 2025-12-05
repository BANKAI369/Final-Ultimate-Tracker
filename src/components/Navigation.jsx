import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Heart, 
  BarChart3, 
  Settings, 
  Target 
} from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/habits', icon: CheckCircle2, label: 'Habits' },
    { path: '/reminders', icon: Clock, label: 'Reminders' },
    { path: '/money', icon: DollarSign, label: 'Money' },
    { path: '/period', icon: Heart, label: 'Period' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="bg-white border-r border-slate-200 w-64 min-h-screen fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Ultimate Tracker</h1>
            <p className="text-xs text-slate-600">Life Dashboard</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;