import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../../lib/api';
import { useAuth } from '../../auth/context/AuthContext';
import { useHome } from '../hooks/useHome';

interface LinkItem {
  _id: string;
  title: string;
  link: string;
  clickCount: number;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { handleDeleteLink } = useHome();

  const fetchLinks = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/links/${user.username}`);
      setLinks(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [user]);

  const handleCreateLink = async (data: any) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      await api.post('/links', { link: data.link, title: data.title });
      setSuccessMsg('Link added successfully!');
      reset();
      fetchLinks();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to create link');
    }
  };

  const handleDelete = async (linkId: string) => {
    try {
      handleDeleteLink({ linkId });
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Link Card */}
      <div className="rounded-2xl border border-white/10 bg-[#171f33]/70 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Add New Link</h2>
        {errorMsg && <p className="mb-3 text-sm text-red-400">{errorMsg}</p>}
        {successMsg && <p className="mb-3 text-sm text-emerald-400">{successMsg}</p>}

        <form onSubmit={handleSubmit(handleCreateLink)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Title</label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full rounded-lg border border-white/10 bg-[#0b1326] px-4 py-2 text-sm text-white focus:border-[#5e8bff] focus:outline-none"
                placeholder="My Portfolio"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-400">{String(errors.title.message)}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">URL</label>
              <input
                type="text"
                {...register('link', { required: 'URL is required' })}
                className="w-full rounded-lg border border-white/10 bg-[#0b1326] px-4 py-2 text-sm text-white focus:border-[#5e8bff] focus:outline-none"
                placeholder="https://example.com"
              />
              {errors.link && (
                <p className="mt-1 text-xs text-red-400">{String(errors.link.message)}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#5e8bff] px-6 py-2 text-sm font-bold text-[#002b75] transition-all hover:bg-[#5e8bff]/90"
          >
            Create Link
          </button>
        </form>
      </div>

      {/* Links List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Active Links</h2>
        <div className="grid gap-4">
          {links.length === 0 ? (
            <p className="text-sm text-slate-500">No links added yet. Create one above!</p>
          ) : (
            links.map((link) => (
              <div
                key={link._id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#171f33]/70 p-4 transition-colors hover:border-[#5e8bff]/40"
              >
                <div>
                  <h3 className="text-base font-bold text-white">{link.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{link.link}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] tracking-widest text-slate-500 uppercase">Clicks</p>
                    <p className="text-sm font-bold text-[#4edea3]">{link.clickCount}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="cursor-pointer p-2 text-slate-400 transition-colors hover:text-red-400"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
