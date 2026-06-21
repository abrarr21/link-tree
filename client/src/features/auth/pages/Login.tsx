import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1326] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#171f33]/70 p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <div className="mb-2 inline-flex items-center gap-2">
            <svg
              className="h-8 w-8 text-[#b3c5ff]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span className="text-2xl font-bold text-[#b3c5ff]">LinkHub</span>
          </div>
          <h2 className="text-xl font-bold text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-400">Log in to manage your link ecosystem</p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-300">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full rounded-lg border border-white/10 bg-[#0b1326] px-4 py-3 text-white transition-colors focus:border-[#5e8bff] focus:outline-none"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{String(errors.email.message)}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-300">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full rounded-lg border border-white/10 bg-[#0b1326] px-4 py-3 text-white transition-colors focus:border-[#5e8bff] focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{String(errors.password.message)}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg bg-[#5e8bff] py-3 font-bold text-[#002b75] transition-transform duration-150 hover:bg-[#5e8bff]/90 active:scale-[0.98]"
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#b3c5ff] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
