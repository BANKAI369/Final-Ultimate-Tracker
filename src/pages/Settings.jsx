import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Download,
  Upload,
  Trash2,
  Save,
  Moon,
  Sun,
  Globe,
  Smartphone
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      timezone: 'America/New_York',
      language: 'English'
    },
    notifications: {
      habits: true,
      reminders: true,
      period: true,
      money: false,
      email: true,
      push: true,
      sound: true
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      backupCloud: true,
      twoFactor: false
    },
    appearance: {
      theme: 'light',
      colorScheme: 'purple',
      compactMode: false,
      animations: true
    }
  });

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const colorSchemes = [
    { id: 'purple', name: 'Purple', colors: 'from-purple-500 to-blue-500' },
    { id: 'green', name: 'Green', colors: 'from-green-500 to-teal-500' },
    { id: 'orange', name: 'Orange', colors: 'from-orange-500 to-red-500' },
    { id: 'pink', name: 'Pink', colors: 'from-pink-500 to-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Customize your Ultimate Tracker experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Settings</h2>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-xl font-semibold text-slate-900">Profile Settings</h2>
                  <p className="text-slate-600 mt-1">Manage your personal information and preferences.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">
                        Change Photo
                      </button>
                      <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors">
                        Remove Photo
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                      <select
                        value={settings.profile.timezone}
                        onChange={(e) => updateSetting('profile', 'timezone', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                      <select
                        value={settings.profile.language}
                        onChange={(e) => updateSetting('profile', 'language', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-xl font-semibold text-slate-900">Notification Settings</h2>
                  <p className="text-slate-600 mt-1">Choose what notifications you want to receive.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">App Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'habits', label: 'Habit Reminders', desc: 'Get reminded to complete your daily habits' },
                        { key: 'reminders', label: 'Task Reminders', desc: 'Notifications for upcoming tasks and appointments' },
                        { key: 'period', label: 'Period Tracking', desc: 'Cycle predictions and symptom reminders' },
                        { key: 'money', label: 'Money Alerts', desc: 'Budget warnings and expense notifications' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-slate-900">{item.label}</h4>
                            <p className="text-sm text-slate-600">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => updateSetting('notifications', item.key, !settings.notifications[item.key])}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.notifications[item.key] ? 'bg-purple-500' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Delivery Methods</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'email', label: 'Email Notifications', icon: Globe },
                        { key: 'push', label: 'Push Notifications', icon: Smartphone },
                        { key: 'sound', label: 'Sound Alerts', icon: Bell },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <Icon className="w-5 h-5 text-slate-600" />
                              <span className="font-medium text-slate-900">{item.label}</span>
                            </div>
                            <button
                              onClick={() => updateSetting('notifications', item.key, !settings.notifications[item.key])}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.notifications[item.key] ? 'bg-purple-500' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div>
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-xl font-semibold text-slate-900">Privacy & Security</h2>
                  <p className="text-slate-600 mt-1">Control your data and security preferences.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    {[
                      { key: 'dataSharing', label: 'Data Sharing', desc: 'Allow anonymous usage data to improve the app' },
                      { key: 'analytics', label: 'Analytics', desc: 'Help us understand how you use the app' },
                      { key: 'backupCloud', label: 'Cloud Backup', desc: 'Automatically backup your data to the cloud' },
                      { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                          <h4 className="font-medium text-slate-900">{item.label}</h4>
                          <p className="text-sm text-slate-600">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => updateSetting('privacy', item.key, !settings.privacy[item.key])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.privacy[item.key] ? 'bg-purple-500' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.privacy[item.key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Data Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="flex items-center justify-center space-x-2 p-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                        <Download className="w-5 h-5 text-slate-600" />
                        <span className="font-medium text-slate-700">Export Data</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 p-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                        <Upload className="w-5 h-5 text-slate-600" />
                        <span className="font-medium text-slate-700">Import Data</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 p-4 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                        <Trash2 className="w-5 h-5" />
                        <span className="font-medium">Delete Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div>
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-xl font-semibold text-slate-900">Appearance</h2>
                  <p className="text-slate-600 mt-1">Customize the look and feel of your app.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Theme</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => updateSetting('appearance', 'theme', 'light')}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          settings.appearance.theme === 'light'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Sun className="w-6 h-6 text-yellow-500" />
                          <span className="font-medium text-slate-900">Light Mode</span>
                        </div>
                      </button>
                      <button
                        onClick={() => updateSetting('appearance', 'theme', 'dark')}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          settings.appearance.theme === 'dark'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Moon className="w-6 h-6 text-slate-600" />
                          <span className="font-medium text-slate-900">Dark Mode</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Color Scheme</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {colorSchemes.map((scheme) => (
                        <button
                          key={scheme.id}
                          onClick={() => updateSetting('appearance', 'colorScheme', scheme.id)}
                          className={`p-4 border-2 rounded-xl transition-all ${
                            settings.appearance.colorScheme === scheme.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className={`w-full h-8 bg-gradient-to-r ${scheme.colors} rounded-lg`}></div>
                            <span className="text-sm font-medium text-slate-900">{scheme.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Display Options</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'compactMode', label: 'Compact Mode', desc: 'Show more content in less space' },
                        { key: 'animations', label: 'Animations', desc: 'Enable smooth transitions and animations' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-slate-900">{item.label}</h4>
                            <p className="text-sm text-slate-600">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => updateSetting('appearance', item.key, !settings.appearance[item.key])}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.appearance[item.key] ? 'bg-purple-500' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.appearance[item.key] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex justify-end">
                <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200">
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;