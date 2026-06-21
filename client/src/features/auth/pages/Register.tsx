import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { register: registerUser, login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await registerUser(data.name, data.username, data.email, data.password);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Registration failed.');
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
          <h2 className="text-xl font-bold text-white">Create an account</h2>
          <p className="mt-1 text-sm text-slate-400">Join to build your single page link deck</p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-300">Full Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full rounded-lg border border-white/10 bg-[#0b1326] px-4 py-3 text-white transition-colors focus:border-[#5e8bff] focus:outline-none"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{String(errors.name.message)}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-300">Username</label>
            <input
              type="text"
              {...register('username', {
                required: 'Username is required',
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain numbers, letters and underscores',
                },
              })}
              className="w-full rounded-lg border border-white/10 bg-[#0b1326] px-4 py-3 text-white transition-colors focus:border-[#5e8bff] focus:outline-none"
              placeholder="johndoe"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-400">{String(errors.username.message)}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-300">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full rounded-lg border border-white/10 bg-[#0b1326] px-4 py-3 text-white transition-colors focus:border-[#5e8bff] focus:outline-none"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{String(errors.email.message)}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-300">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
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
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#b3c5ff] hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};
