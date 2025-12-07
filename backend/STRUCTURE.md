# Backend Structure Guide

## Models (`src/models/`)
Database schemas and models:
- `User.js` - User account schema
- `Habit.js` - Habit tracking schema
- Add more models as needed: Transaction.js, Reminder.js, Period.js, etc.

## Routes (`src/routes/`)
API endpoints:
- `auth.js` - Authentication routes (login, register, logout)
- `habits.js` - Habit CRUD operations
- Add more routes as needed: money.js, reminders.js, period.js, etc.

## Middleware (`src/middleware/`)
- `auth.js` - Authentication middleware (JWT verification)
- Add more middleware as needed: errorHandler.js, validation.js, etc.

## Config (`src/config/`)
Configuration files:
- `database.js` - Database connection configuration
- `constants.js` - Application constants

## Entry Point
- `index.js` - Express server initialization

## Environment
- `.env` - Environment variables (keep secret, don't commit)
- `.env.example` - Example environment variables template

## Root Files
- `package.json` - Dependencies and scripts
- `.gitignore` - Git ignore rules
