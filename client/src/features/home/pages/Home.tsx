import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { api } from '../../../lib/api';
import { useHome } from '../hooks/useHome';

interface LinkItem {
  _id: string;
  title: string;
  link: string;
}

export const Home: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { handleLinkClick } = useHome();

  useEffect(() => {
    const fetchUserLinks = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/links/${username}`);
        setLinks(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    if (username) fetchUserLinks();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1326] text-slate-300">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-[#5e8bff]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b1326] px-4">
        <h1 className="text-2xl font-bold text-red-400">Error</h1>
        <p className="mt-2 text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0b1326] px-4 py-16 text-white">
      <div className="mx-auto w-full max-w-[640px] space-y-12">
        {/* Profile Header */}
        <div className="space-y-4 text-center">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-[#5e8bff]/20 bg-[#171f33] shadow-xl">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#171f33] to-[#2d3449] text-3xl font-bold text-[#b3c5ff]">
              {username?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight">@{username}</h1>
            <p className="text-sm text-slate-400">Welcome to my link directory</p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <p className="text-center text-sm text-slate-500">No links published yet.</p>
          ) : (
            links.map((link) => (
              <button
                key={link._id}
                onClick={() => {
                  handleLinkClick({ linkId: link._id });
                  window.open(link.link, '_blank');
                }}
                rel="noopener noreferrer"
                className="block w-full cursor-pointer rounded-xl border border-white/5 bg-[#171f33] px-6 py-4 text-center font-semibold text-[#dae2fd] shadow-lg transition-all duration-150 hover:scale-[1.01] hover:bg-[#171f33]/90 active:scale-[0.99]"
              >
                {link.title}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-[#171f33] px-4 py-2 opacity-60">
          <svg className="h-4 w-4 text-[#5e8bff]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464a1 1 0 10-1.414-1.414l-.707.707a1 1 0 101.414 1.414l.707-.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM14.243 14.243a1 1 0 10-1.414-1.414l-.707.707a1 1 0 101.414 1.414l.707-.707z" />
          </svg>
          <span className="text-[10px] font-bold tracking-widest text-[#dae2fd] uppercase">
            Powered by LinkHub
          </span>
        </div>
      </div>
    </div>
  );
};
