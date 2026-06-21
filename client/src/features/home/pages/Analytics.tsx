import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useAuth } from '../../auth/context/AuthContext';

interface AnalyticsData {
  totalLinks: number;
  totalClicks: number;
  links: Array<{ id: string; link: string; clickCount: number }>;
}

export const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      try {
        const res = await api.get(`/links/${user.username}/analytics`);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-[#5e8bff]" />
      </div>
    );
  }

  const viewsCount = (data?.totalClicks || 0) * 2.5; // Mock views count to estimate CTR
  const ctr =
    data && data.totalClicks > 0 ? ((data.totalClicks / viewsCount) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#171f33]/70 p-6">
          <p className="text-xs tracking-widest text-slate-500 uppercase">Total Links</p>
          <h3 className="mt-2 text-3xl font-extrabold text-white">{data?.totalLinks || 0}</h3>
          <p className="mt-4 text-xs text-slate-400">Active in directory</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#171f33]/70 p-6">
          <p className="text-xs tracking-widest text-[#5e8bff] text-slate-500 uppercase">
            Total Clicks
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-[#5e8bff]">{data?.totalClicks || 0}</h3>
          <p className="mt-4 text-xs text-slate-400">Accumulated clicks</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#171f33]/70 p-6">
          <p className="text-xs tracking-widest text-slate-500 uppercase">Average CTR</p>
          <h3 className="mt-2 text-3xl font-extrabold text-white">{ctr}%</h3>
          <p className="mt-4 text-xs text-slate-400">Estimated Click-Through Rate</p>
        </div>
      </div>

      {/* Top Performing Links Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#171f33]/70">
        <div className="border-b border-white/5 bg-white/5 p-6">
          <h4 className="font-bold text-white">Link Performance Rankings</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 bg-[#0b1326]/50 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-4">Destination Link</th>
                <th className="px-6 py-4">Total Clicks</th>
                <th className="px-6 py-4">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-slate-300">
              {!data || data.links.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    No clicks recorded.
                  </td>
                </tr>
              ) : (
                data.links.map((link) => {
                  const share =
                    data.totalClicks > 0
                      ? Math.round((link.clickCount / data.totalClicks) * 100)
                      : 0;
                  return (
                    <tr key={link.id} className="transition-colors hover:bg-white/5">
                      <td className="max-w-[300px] truncate px-6 py-4 font-medium text-white">
                        {link.link}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#4edea3]">{link.clickCount}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-white/5">
                            <div className="h-full bg-[#5e8bff]" style={{ width: `${share}%` }} />
                          </div>
                          <span className="text-xs text-slate-400">{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
