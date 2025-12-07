# Ultimate Tracker - Complete Life Dashboard

A full-stack application for tracking habits, reminders, money, and period cycles.

## Project Structure

```
ultimate-tracker/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable components (Layout, Navigation)
│   │   ├── pages/              # Page components (Dashboard, Habits, etc.)
│   │   ├── context/            # React context (ThemeContext, etc.)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                     # Node.js/Express backend API
│   ├── src/
│   │   ├── models/             # Database schemas (User, Habit, etc.)
│   │   ├── routes/             # API routes (auth, habits, etc.)
│   │   ├── middleware/         # Express middleware
│   │   ├── config/             # Configuration files
│   │   └── index.js            # Entry point
│   ├── package.json
│   ├── .env                    # Environment variables
│   └── .gitignore
│
└── README.md                    # This file
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Features

- 📊 **Dashboard** - Overview of all activities
- 🎯 **Habits** - Track daily habits with streaks
- ⏰ **Reminders** - Set and manage reminders
- 💰 **Money** - Track income, expenses, budgets, and goals
- 🔴 **Period** - Track menstrual cycles and symptoms
- 📈 **Analytics** - View detailed statistics
- ⚙️ **Settings** - Customize appearance and preferences
- 🌙 **Dark Mode** - Light and dark theme support

## Technology Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Lucide React (Icons)
- React Router

**Backend:**
- Node.js
- Express.js
- MongoDB (recommended)

## Development

All pages start with empty data. Users can add their own data through the application's UI.
