import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, AlertCircle, ShieldCheck, GraduationCap, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'supervisor') navigate('/supervisor/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuick = (quickEmail, quickPass) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 p-8 sm:p-10 relative z-10 transition-all">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Portal Sign In</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Access your student workspace, review desk, or coordinator tools</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-100 text-red-700 text-xs rounded-2xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@fyp.edu.pk"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Fillers */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Fast Fill Demo Credentials
          </p>
          <div className="flex justify-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillQuick('student@fyp.edu.pk', 'studentpassword123')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl text-slate-700 font-bold transition"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => fillQuick('ayesha@fyp.edu.pk', 'supervisorpassword123')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-violet-50 hover:text-violet-600 rounded-xl text-slate-700 font-bold transition"
            >
              Supervisor
            </button>
            <button
              type="button"
              onClick={() => fillQuick('admin@fyp.edu.pk', 'adminpassword123')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-pink-50 hover:text-pink-600 rounded-xl text-slate-700 font-bold transition"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
