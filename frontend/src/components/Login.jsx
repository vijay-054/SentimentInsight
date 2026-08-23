import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pageBg p-4 selection:bg-brandGreen/30">
      <div className="w-full max-w-md bg-cardSurface border border-borderBorder rounded-[4px] shadow-2xl p-8">
        
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded bg-brandGreen flex items-center justify-center text-pageBg font-bold text-sm">
            SI
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">SentimentInsight<span className="text-brandGreen">AI</span></h1>
        </div>

        <h2 className="text-white text-lg font-semibold text-center mb-6">Sign in to your account</h2>

        {error && (
          <div className="mb-4 p-3 bg-brandRed/10 border border-brandRed/20 rounded-[4px] text-brandRed text-sm text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-mutedText mb-1.5">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-inputBg border border-borderBorder rounded-[4px] px-3 py-2 text-primaryText focus:outline-none focus:border-brandGreen focus:ring-1 focus:ring-brandGreen transition-colors"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-mutedText mb-1.5">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-inputBg border border-borderBorder rounded-[4px] px-3 py-2 text-primaryText focus:outline-none focus:border-brandGreen focus:ring-1 focus:ring-brandGreen transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brandGreen text-[#051424] font-bold rounded-[4px] py-2.5 mt-2 flex items-center justify-center gap-2 transition-all hover:bg-opacity-90 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-pageBg focus-visible:ring-brandGreen"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-mutedText">
          Don't have an account? <Link to="/signup" className="text-brandGreen hover:underline font-medium focus:outline-none focus-visible:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
