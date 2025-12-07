# 404 Error Troubleshooting Guide

## Common Causes & Solutions

### 1. **Backend Not Running**
- Check if server is running on port 5000
- In terminal: `cd backend && npm run dev`
- Should see: `Server running on port 5000`

### 2. **Wrong API URL**
Frontend `.env` file should have:
```
VITE_API_URL=http://localhost:5000/api
```

Check it exists:
```bash
cat Frontend/.env
```

### 3. **CORS Issues**
Backend `.env` must have correct CLIENT_URL:
```
CLIENT_URL=http://localhost:5173
```

### 4. **Route Not Registered**
Check `backend/index.js` has:
```javascript
const authRoutes = require('./src/routes/auth');
app.use('/api/auth', authRoutes);
```

### 5. **Missing Environment Variables**
Backend needs `.env`:
```
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## Testing the API

### Test 1: Check Backend is Running
```bash
curl http://localhost:5000
# Should return: {"message":"Ultimate Tracker API running"}
```

### Test 2: Test Register Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test 3: Test Login Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test 4: Test Get User (with token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend Console Debugging

In browser developer tools (F12):
1. Go to **Network** tab
2. Try to login
3. Look for the failed request
4. Click on it and check:
   - **URL** - Should be `http://localhost:5000/api/auth/login`
   - **Status** - Should be 2xx (not 404)
   - **Request Headers** - Should have `Content-Type: application/json`
   - **Response** - Check the error message

## Step-by-Step Debugging

### Step 1: Start Backend
```bash
cd backend
npm install
npm run dev
```
Expected: `Server running on port 5000`

### Step 2: Verify MongoDB Connection
Expected: `✅ MongoDB Connected`

### Step 3: Start Frontend
```bash
cd Frontend
npm install
npm run dev
```
Expected: App runs on `http://localhost:5173`

### Step 4: Check Frontend .env
```bash
cat Frontend/.env
```
Should output: `VITE_API_URL=http://localhost:5000/api`

### Step 5: Try Login
1. Go to `http://localhost:5173/auth`
2. Click Register or Login
3. Open DevTools Network tab (F12)
4. Submit form
5. Check the request URL and response

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot GET /api/auth/register` | Route not registered | Check `index.js` |
| `CORS error` | Wrong CLIENT_URL | Update `.env` |
| `404 Not Found` | Server not running | Start backend |
| `Connection refused` | Backend not listening | Check PORT |
| `token required` | Missing auth header | Login first |

## If Still Getting 404

1. **Clear everything:**
   ```bash
   # Stop both servers (Ctrl+C)
   # Clear node_modules
   rm -r Backend/node_modules Frontend/node_modules
   rm -r Backend/node_modules Frontend/node_modules
   
   # Reinstall
   cd backend && npm install
   cd ../Frontend && npm install
   ```

2. **Check file locations:**
   ```bash
   ls backend/src/routes/auth.js
   ls Frontend/src/context/AuthContext.jsx
   ```

3. **Verify imports in main files:**
   - `backend/index.js` should import auth routes
   - `Frontend/src/App.jsx` should use AuthProvider

4. **Restart both servers:**
   - Terminal 1: `cd backend && npm run dev`
   - Terminal 2: `cd Frontend && npm run dev`

## Still Not Working?

Check these files exist and are properly configured:

```
backend/
├── index.js ✓
├── .env ✓
├── package.json ✓
├── src/
│   ├── routes/auth.js ✓
│   ├── models/User.js ✓
│   └── middleware/auth.js ✓

Frontend/
├── .env ✓
├── src/
│   ├── context/AuthContext.jsx ✓
│   ├── pages/Auth.jsx ✓
│   ├── App.jsx ✓
│   └── main.jsx ✓
```
