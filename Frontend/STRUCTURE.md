# Frontend Structure Guide

## Components (`src/components/`)
- `Layout.jsx` - Main layout wrapper with sidebar and navigation
- `Navigation.jsx` - Left sidebar navigation component

## Pages (`src/pages/`)
- `Dashboard.jsx` - Home page with quick overview
- `Habits.jsx` - Habit tracking and management
- `Reminders.jsx` - Reminder management
- `Money.jsx` - Financial tracking (income, expenses, budgets, goals)
- `Period.jsx` - Period cycle and symptom tracking
- `Analytics.jsx` - Statistics and analytics views
- `Settings.jsx` - User preferences and app settings

## Context (`src/context/`)
- `ThemeContext.jsx` - Global theme management (light/dark mode)

## Entry Points
- `App.jsx` - Main application component with routing
- `main.jsx` - React 18 DOM rendering
- `index.css` - Global styles

## Configuration
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
