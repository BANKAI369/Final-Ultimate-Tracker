# Quick Start - Fix 404 Errors

## Issue
Getting `404 Not Found` when frontend tries to call backend API.

## Root Causes
1. Backend server not running
2. Frontend not finding the API URL
3. Vite dev server on wrong port
4. Missing .env files

## Quick Fix (5 minutes)

### Step 1: Create Frontend .env (if missing)
**File: `Frontend/.env`**
```
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Verify Backend .env
**File: `backend/.env`**
Should have:
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

### Step 3: Start Backend
```bash
cd backend
npm install  # if not done
npm run dev
```

Wait for:
```
✅ MongoDB Connected
Server running on port 5000
```

### Step 4: Start Frontend (in new terminal)
```bash
cd Frontend
npm run dev
```

Frontend will open automatically on `http://localhost:5173`

### Step 5: Test Auth
1. Click on the page or wait for redirect to `/auth`
2. Try to Register or Login
3. Check browser DevTools (F12 → Network tab) for API calls
4. You should see requests to `http://localhost:5000/api/auth/...`

## What Each Terminal Should Show

**Terminal 1 (Backend):**
```
✅ MongoDB Connected
Server running on port 5000
```

**Terminal 2 (Frontend):**
```
➜  Local:   http://localhost:5173/
➜  press h to show help
```

## If Still Getting 404

### Check 1: Is Backend Running?
```bash
curl http://localhost:5000
# Should return: {"message":"Ultimate Tracker API running"}
```

### Check 2: Frontend .env Exists
```bash
cat Frontend/.env
# Should output: VITE_API_URL=http://localhost:5000/api
```

### Check 3: Clear Cache & Reinstall
```bash
# Terminal 1 - Stop all servers (Ctrl+C)

# Clear node_modules
rm -rf backend/node_modules
rm -rf Frontend/node_modules

# Reinstall
cd backend && npm install
cd ../Frontend && npm install

# Restart
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd Frontend && npm run dev
```

### Check 4: Check Network Tab in Browser
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to login
4. Click on the failed request
5. Check:
   - **URL**: Should be `http://localhost:5000/api/auth/...`
   - **Status**: Should be 200-201 (not 404)
   - **Response**: Check error message

## File Checklist

Make sure these files exist:

```
✓ backend/.env
✓ backend/index.js
✓ backend/src/routes/auth.js
✓ backend/src/models/User.js
✓ backend/src/middleware/auth.js

✓ Frontend/.env
✓ Frontend/src/context/AuthContext.jsx
✓ Frontend/src/pages/Auth.jsx
✓ Frontend/src/App.jsx
```

## Expected Behavior

1. App starts
2. Redirects to `/auth` page
3. You can Register or Login
4. Network requests go to backend
5. Successful login redirects to Dashboard

## Need Help?

Check:
1. Both servers running (`npm run dev` in each terminal)
2. Frontend `.env` has correct API URL
3. Backend `.env` has correct MONGO_URI
4. No typos in file paths
5. Ports: Backend=5000, Frontend=5173
