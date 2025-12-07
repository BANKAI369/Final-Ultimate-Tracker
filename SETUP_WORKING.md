# Quick Setup & Test Guide

## 🚀 Run Both Servers

### Terminal 1: Start Backend
```powershell
cd "C:\Users\Sameer\Downloads\Ultimate Final Tracker\project\backend"
npm run dev
```

Expected output:
```
✅ MongoDB connected
✅ Server running on port 5000
```

### Terminal 2: Start Frontend
```powershell
cd "C:\Users\Sameer\Downloads\Ultimate Final Tracker\project\Frontend"
npm run dev
```

Expected output:
```
VITE v5.4.21 ready in 358 ms
➜  Local:   http://localhost:5173/
```

---

## 🌐 Access App

Open your browser:
```
http://localhost:5173
```

---

## 🧪 Test Auth Flow

### 1. Open DevTools (F12)
- Go to **Network** tab
- Filter by **XHR/Fetch**

### 2. Try to Register
- Click register tab
- Enter: Name, Email, Password
- Click Register button

### 3. Watch Network Tab
- Look for requests to `http://localhost:5000/api/auth/register`
- Check the response status and body

### 4. If you see a 404:
- **Check the Request URL** — is it `http://localhost:5000/api/auth/register`?
- **Check the Response** — what does it say?
- **Check Backend Logs** — is there an error there?

---

## 📋 Current Configuration

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ All Endpoints Working

Tested with PowerShell:
- ✅ POST /api/auth/register → 201 (returns token + user)
- ✅ POST /api/auth/login → 200 (returns token + user)
- ✅ GET /api/auth/me → 200 (requires Bearer token)
- ✅ POST /api/auth/logout → 200 (requires Bearer token)

---

## 🔍 If Frontend Still Shows 404

**Provide this info:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to register
4. Find the failed request and tell me:
   - **Request URL** (e.g., `http://localhost:5000/api/auth/register`)
   - **Response Status** (e.g., 404, 500, etc.)
   - **Response Body** (what does the error say?)
5. Also paste your Frontend .env and Backend .env contents

---

## 🎯 Status

- ✅ Backend running on port 5000
- ✅ Frontend running on port 5173
- ✅ MongoDB connected
- ✅ CORS configured (CLIENT_URL = http://localhost:5173)
- ✅ All auth endpoints functional
- ✅ AuthContext and API URL configured

**Next Step:** Open http://localhost:5173 and test the login/register flow. If you still see 404, capture the Network tab request details.
