# Frontend Authentication Integration

## Files Created/Modified

### 1. **AuthContext.jsx** (`src/context/AuthContext.jsx`)
Global authentication context that manages:
- User state
- Login/Register/Logout functions
- Token management
- API communication with backend

**Key Methods:**
- `login(email, password)` - Authenticate user
- `register(name, email, password)` - Create new account
- `logout()` - Clear session
- `checkAuth()` - Verify existing session on app load

### 2. **Auth.jsx** (`src/pages/Auth.jsx`)
Complete authentication page with:
- Login form
- Registration form
- Form toggle between login and signup
- Error/Success messages
- Password visibility toggle
- Dark mode support
- Responsive design

### 3. **ProtectedRoute.jsx** (`src/components/ProtectedRoute.jsx`)
Route protection component that:
- Checks if user is authenticated
- Redirects to `/auth` if not logged in
- Shows loading state while checking auth

### 4. **App.jsx** (Modified)
Updated with:
- Auth routes (public)
- Protected routes (require login)
- Theme and Auth providers
- Route guards using ProtectedRoute

### 5. **.env.example**
Configuration template:
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints Used

The frontend calls these backend endpoints:

### POST `/api/auth/register`
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST `/api/auth/login`
**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### GET `/api/auth/me`
**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST `/api/auth/logout`
**Headers:**
```
Authorization: Bearer jwt_token_here
```

## Usage in Components

### Using the useAuth Hook

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Create .env file
```bash
cp .env.example .env
```

### 3. Configure Environment
Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Update Navigation (Optional)
Add logout button to Navigation.jsx:
```javascript
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navigation = () => {
  const { logout, user } = useAuth();
  
  return (
    <div>
      {/* ... existing nav items ... */}
      <button onClick={logout}>
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
};
```

## Flow Diagram

```
User Visits App
    ↓
App Checks Saved Token
    ↓
    ├─ Token Valid → Show Dashboard (Protected)
    └─ No Token → Show Auth Page
         ↓
    User Registers/Logins
         ↓
    Backend Validates & Returns Token
         ↓
    Frontend Saves Token (localStorage)
         ↓
    Redirect to Dashboard
```

## Security Notes

1. **Token Storage** - JWT stored in `localStorage`
2. **Token Persistence** - Token sent in `Authorization` header
3. **Protected Routes** - All app routes require authentication
4. **Auto Logout** - Invalid/expired tokens clear auth state
5. **CORS** - Backend must allow frontend origin

## Next Steps

1. Create backend authentication routes (see backend/AUTH_SETUP.md)
2. Configure JWT secret in backend
3. Test login/register flow
4. Add password reset functionality (optional)
5. Add email verification (optional)
