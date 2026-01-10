import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">

        {/* Top Bar (Mobile) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 shadow">
          <button
            className="text-2xl"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
          <span className="font-semibold text-lg">Ultimate Tracker</span>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 shadow-lg transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:inset-0`}
        >
          {/* Close button (mobile) */}
          <div className="md:hidden flex justify-end p-4">
            <button
              className="text-xl"
              onClick={() => setIsSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          <Navigation />
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="md:ml-64 min-h-screen transition-all">
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;
