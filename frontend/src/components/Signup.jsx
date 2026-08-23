import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [mainError, setMainError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setMainError('');
      setLoading(true);
      await signup(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setMainError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null }); // clear error on type
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

        <h2 className="text-white text-lg font-semibold text-center mb-6">Create an account</h2>

        {mainError && (
          <div className="mb-4 p-3 bg-brandRed/10 border border-brandRed/20 rounded-[4px] text-brandRed text-sm text-center" role="alert">
            {mainError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-mutedText mb-1.5">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full bg-inputBg border ${errors.name ? 'border-brandRed' : 'border-borderBorder'} rounded-[4px] px-3 py-2 text-primaryText focus:outline-none focus:border-brandGreen focus:ring-1 focus:ring-brandGreen transition-colors`}
              placeholder="Jane Doe"
            />
            {errors.name && <p id="name-error" className="mt-1.5 text-sm text-brandRed font-medium">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-mutedText mb-1.5">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full bg-inputBg border ${errors.email ? 'border-brandRed' : 'border-borderBorder'} rounded-[4px] px-3 py-2 text-primaryText focus:outline-none focus:border-brandGreen focus:ring-1 focus:ring-brandGreen transition-colors`}
              placeholder="you@company.com"
            />
            {errors.email && <p id="email-error" className="mt-1.5 text-sm text-brandRed font-medium">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-mutedText mb-1.5">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`w-full bg-inputBg border ${errors.password ? 'border-brandRed' : 'border-borderBorder'} rounded-[4px] px-3 py-2 text-primaryText focus:outline-none focus:border-brandGreen focus:ring-1 focus:ring-brandGreen transition-colors`}
              placeholder="Minimum 8 characters"
            />
            {errors.password && <p id="password-error" className="mt-1.5 text-sm text-brandRed font-medium">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-mutedText mb-1.5">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              className={`w-full bg-inputBg border ${errors.confirmPassword ? 'border-brandRed' : 'border-borderBorder'} rounded-[4px] px-3 py-2 text-primaryText focus:outline-none focus:border-brandGreen focus:ring-1 focus:ring-brandGreen transition-colors`}
              placeholder="Repeat your password"
            />
            {errors.confirmPassword && <p id="confirmPassword-error" className="mt-1.5 text-sm text-brandRed font-medium">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brandGreen text-[#051424] font-bold rounded-[4px] py-2.5 mt-2 flex items-center justify-center gap-2 transition-all hover:bg-opacity-90 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-pageBg focus-visible:ring-brandGreen"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-mutedText">
          Already have an account? <Link to="/login" className="text-brandGreen hover:underline font-medium focus:outline-none focus-visible:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
