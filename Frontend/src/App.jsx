import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Reminders from './pages/Reminders';
import Money from './pages/Money';
import Period from './pages/Period';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth" element={<Auth />} />

            {/* Main Routes - No Auth Gate */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="habits" element={<Habits />} />
              <Route path="reminders" element={<Reminders />} />
              <Route path="money" element={<Money />} />
              <Route path="period" element={<Period />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;