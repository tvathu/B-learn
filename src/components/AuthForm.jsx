import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

const AuthForm = ({ role }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isTeacher = role === 'teacher';
  
  // Theme styling based on role
  const accentColor = isTeacher ? 'text-teal-600 focus:border-teal-500 focus:ring-teal-100' : 'text-indigo-600 focus:border-indigo-500 focus:ring-indigo-100';
  const buttonBg = isTeacher ? 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-200' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-200';
  const textHover = isTeacher ? 'text-teal-600 hover:text-teal-700' : 'text-indigo-600 hover:text-indigo-700';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const { name, email, password } = formData;
    
    // Basic validation
    if (isRegister && !name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegister) {
        const result = register(name, email, password, role);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.message);
        }
      } else {
        const result = login({ email, role });
        if (result.success) {
          navigate('/');
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-2">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">
          {isRegister ? 'Create an Account' : 'Welcome Back'}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {isRegister 
            ? 'Sign up to start sharing and learning new skills today.' 
            : `Log in to access your Blearn ${isTeacher ? 'Teacher Portal' : 'Student Space'}.`
          }
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-sm font-medium text-rose-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4.5">
        {/* Name (Register Mode Only) */}
        {isRegister && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Sarah Jenkins"
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pr-4 pl-11 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-4 ${accentColor}`}
                required
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={isTeacher ? 'sarah@blearn.com' : 'alex@blearn.com'}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pr-4 pl-11 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-4 ${accentColor}`}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="password">
              Password
            </label>
            {!isRegister && (
              <a href="#forgot" className={`text-xs font-semibold hover:underline ${textHover}`}>
                Forgot password?
              </a>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pr-11 pl-11 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-4 ${accentColor}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 hover:text-slate-600 outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-bold text-white shadow-premium transition-all active:scale-98 focus:outline-none focus:ring-4 disabled:opacity-75 disabled:cursor-not-allowed ${buttonBg}`}
        >
          {isLoading ? (
            <span>Processing...</span>
          ) : (
            <>
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Mock Hint (For convenience) */}
      <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-400 leading-normal">
        <span className="font-bold text-slate-500 uppercase block mb-0.5">Demo Access:</span>
        Email: <span className="font-mono text-slate-600">{isTeacher ? 'sarah@blearn.com' : 'alex@blearn.com'}</span> | Password: <span className="font-mono text-slate-600">password</span>
      </div>

      {/* Switch Form Trigger */}
      <div className="mt-6 text-center text-sm text-slate-500">
        {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
          className={`font-semibold hover:underline outline-none ${textHover}`}
        >
          {isRegister ? 'Sign in' : 'Register here'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
