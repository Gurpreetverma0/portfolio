import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Trophy,
  Award,
  Images,
  Cpu,
  FileText,
  Mail,
  Eye,
  CheckCircle2,
  FileEdit,
  Download,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import toast from 'react-hot-toast';
import { adminApi } from '../../services/api';
import { formatFullDate } from '../../utils/formatters';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then((res) => setStats(res.data.data))
      .catch(() => toast.error('Failed to load dashboard metrics'))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    try {
      const res = await adminApi.exportJson();
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Portfolio JSON backup downloaded');
    } catch {
      toast.error('Backup export failed');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-white dark:bg-obsidian-850 border border-zinc-200 dark:border-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const c = stats?.counts || {};

  const cards = [
    { label: 'Projects', value: c.projects ?? 0, icon: FolderKanban, to: '/admin/projects', color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Achievements', value: c.achievements ?? 0, icon: Trophy, to: '/admin/achievements', color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Certificates', value: c.certificates ?? 0, icon: Award, to: '/admin/certificates', color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Gallery Images', value: c.gallery ?? 0, icon: Images, to: '/admin/gallery', color: 'text-pink-500 bg-pink-500/10' },
    { label: 'Skills', value: c.skills ?? 0, icon: Cpu, to: '/admin/skills', color: 'text-cyan-500 bg-cyan-500/10' },
    { label: 'Blog Posts', value: c.blogs ?? 0, icon: FileText, to: '/admin/blogs', color: 'text-violet-500 bg-violet-500/10' },
    { label: 'Messages', value: c.messages ?? 0, badge: c.unreadMessages ? `${c.unreadMessages} unread` : null, icon: Mail, to: '/admin/messages', color: 'text-rose-500 bg-rose-500/10' },
    { label: 'Page Views (14d)', value: c.totalViews ?? 0, icon: Eye, to: '/admin/settings', color: 'text-blue-500 bg-blue-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Real-time portfolio inventory, traffic analytics, and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{c.publishedContent ?? 0} Published</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <FileEdit className="w-4 h-4" />
            <span>{c.draftContent ?? 0} Drafts</span>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, to, color, badge }) => (
          <Link
            key={label}
            to={to}
            className="group glass-card rounded-2xl p-5 hover:border-indigo-500/50 transition flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</span>
                {badge && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500">
                    {badge}
                  </span>
                )}
              </div>
            </div>
            <div className={`p-3 rounded-xl ${color} group-hover:scale-105 transition`}>
              <Icon className="w-5 h-5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">Visitor Analytics</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Page views vs unique daily visitors ({c.totalUniqueVisitors ?? 0} unique)
              </p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.visitorChart || []}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#71717a" />
                <YAxis tick={{ fontSize: 11 }} stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101018',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="#6366f1" fill="url(#viewsGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="visitors" stroke="#10b981" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold">Content Overview</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Published vs draft items across core portfolio modules
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.contentBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#71717a" />
                <YAxis tick={{ fontSize: 11 }} stroke="#71717a" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101018',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="published" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} />
                <Bar dataKey="draft" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Messages & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Recent Contact Messages</h2>
            <Link
              to="/admin/messages"
              className="text-xs text-indigo-500 hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {stats?.recentMessages?.length ? (
            <div className="space-y-3">
              {stats.recentMessages.map((m) => (
                <div
                  key={m._id}
                  className="p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200/70 dark:border-white/[0.06]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate">{m.subject}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        m.status === 'unread'
                          ? 'bg-rose-500/15 text-rose-500'
                          : 'bg-zinc-500/15 text-zinc-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {m.name} ({m.email}) • {formatFullDate(m.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 py-8 text-center">No contact messages yet.</p>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold">Recent Admin Activity</h2>
          </div>
          {stats?.recentActivity?.length ? (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {stats.recentActivity.map((act) => (
                <div key={act._id} className="flex items-start gap-3 text-xs">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-zinc-800 dark:text-zinc-200 font-medium">{act.summary}</p>
                    <p className="text-zinc-500 mt-0.5">
                      {act.action} • {act.resourceType} • {formatFullDate(act.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 py-8 text-center">No activity logged yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
