import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader } from 'lucide-react';

const Auth = () => {
  const { login, signup, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [mode, setMode] = useState('login'); // login | signup | forgot | reset
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Detect reset link
  useEffect(() => {
    if (params.get('token') && params.get('id')) {
      setMode('reset');
    }
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'login') {
      const res = await login(form.email, form.password);
      if (res.success) navigate('/');
      else setError(res.error);
    }

    if (mode === 'signup') {
      if (form.password !== form.confirm) {
        setError('Passwords do not match');
        return;
      }
      const res = await signup(form.name, form.email, form.password);
      if (res.success) navigate('/');
      else setError(res.error);
    }

    if (mode === 'forgot') {
      const res = await forgotPassword(form.email);
      if (res.success) setSuccess('Reset link sent to email');
      else setError(res.error);
    }

    if (mode === 'reset') {
      const res = await resetPassword(
        params.get('token'),
        params.get('id'),
        form.password
      );
      if (res.success) {
        setSuccess('Password reset successful');
        setMode('login');
      } else {
        setError(res.error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-sm shadow"
      >
        <h2 className="text-xl font-bold mb-4 text-center capitalize">
          {mode.replace('-', ' ')}
        </h2>

        {mode === 'signup' && (
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            required
          />
        )}

        {(mode !== 'reset') && (
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            required
          />
        )}

        {(mode !== 'forgot') && (
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            required
          />
        )}

        {(mode === 'signup' || mode === 'reset') && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            required
          />
        )}

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <button className="w-full bg-purple-600 text-white py-2 rounded">
          Submit
        </button>

        <div className="text-sm text-center mt-4 space-y-1">
          {mode === 'login' && (
            <>
              <button type="button" onClick={() => setMode('signup')} className="underline">
                Create account
              </button>
              <br />
              <button type="button" onClick={() => setMode('forgot')} className="underline">
                Forgot password?
              </button>
            </>
          )}

          {(mode === 'signup' || mode === 'forgot') && (
            <button type="button" onClick={() => setMode('login')} className="underline">
              Back to login
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Auth;
