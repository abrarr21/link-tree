import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../features/auth/context/AuthContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0b1326] text-white md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-50 hidden h-screen w-64 flex-col justify-between border-r border-white/10 bg-[#171f33] px-4 py-8 md:flex">
        <div className="space-y-8">
          <div className="flex items-center gap-2 px-2">
            <svg
              className="h-8 w-8 text-[#5e8bff]"
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
            <span className="text-xl font-bold text-white">LinkHub</span>
          </div>

          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? 'border-r-4 border-[#5e8bff] bg-[#5e8bff]/10 font-bold text-[#5e8bff]'
                    : 'font-medium text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span>Links</span>
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? 'border-r-4 border-[#5e8bff] bg-[#5e8bff]/10 font-bold text-[#5e8bff]'
                    : 'font-medium text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span>Analytics</span>
            </NavLink>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="space-y-1 border-t border-white/5 pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <span>Logout</span>
            </button>
          </div>

          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d3449] font-bold text-[#b3c5ff]">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">Admin Console</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex min-h-screen flex-1 flex-col pb-20 md:ml-64 md:pb-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#0b1326]/80 px-6 backdrop-blur-md">
          <h1 className="text-lg font-extrabold text-white">Console</h1>
          {user && (
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-[#5e8bff] hover:underline"
            >
              Preview Profile
            </a>
          )}
        </header>

        <main className="mx-auto w-full max-w-[1200px] flex-1 p-6 md:p-8">{children}</main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t border-white/10 bg-[#171f33] md:hidden">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-[#5e8bff]' : 'text-slate-400'}`
          }
        >
          <span className="text-[10px] font-bold tracking-wider uppercase">Links</span>
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-[#5e8bff]' : 'text-slate-400'}`
          }
        >
          <span className="text-[10px] font-bold tracking-wider uppercase">Analytics</span>
        </NavLink>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-slate-400">
          <span className="text-[10px] font-bold tracking-wider uppercase">Logout</span>
        </button>
      </nav>
    </div>
  );
};
