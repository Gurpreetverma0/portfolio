import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Trophy,
  Award,
  Images,
  Cpu,
  Briefcase,
  GraduationCap,
  Wrench,
  MessageSquareQuote,
  FileText,
  Mail,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sun,
  Moon,
  Shield,
  KeyRound,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePortfolio } from '../context/PortfolioContext';
import Modal from '../components/common/Modal';
import { authApi } from '../services/api';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/skills', label: 'Skills', icon: Cpu },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/education', label: 'Education', icon: GraduationCap },
  { to: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/profile', label: 'Profile & Resume', icon: UserCircle },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { refreshPortfolio } = usePortfolio();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out safely');
    navigate('/admin/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await authApi.changePassword(pwForm);
      toast.success('Password updated');
      setPasswordModalOpen(false);
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwSaving(false);
    }
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-white dark:bg-obsidian-900 border-r border-zinc-200 dark:border-white/10">
      <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-white/10">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
            <Shield className="w-5 h-5" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="truncate">
              <p className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
                Portfolio CMS
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Admin Console</p>
            </div>
          )}
        </Link>
        {isMobile ? (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {(!collapsed || isMobile) && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-zinc-200 dark:border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || isMobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-obsidian-950 text-zinc-900 dark:text-zinc-100">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full">
            <SidebarContent isMobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between gap-4 bg-white/80 dark:bg-obsidian-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live MongoDB Sync Active</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              onClick={() => refreshPortfolio()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((o) => !o)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-none">{admin?.name || 'Admin'}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 capitalize">
                    {admin?.role || 'admin'}
                  </p>
                </div>
              </button>

              {profileMenuOpen && (
                <div
                  onMouseLeave={() => setProfileMenuOpen(false)}
                  className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-obsidian-850 border border-zinc-200 dark:border-white/10 shadow-xl py-1.5 z-40"
                >
                  <div className="px-3.5 py-2 border-b border-zinc-200 dark:border-white/10">
                    <p className="text-xs font-semibold truncate">{admin?.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{admin?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setPasswordModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-white/5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <Modal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Change Admin Password"
        size="sm"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">
              New Password (min 8 chars)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPasswordModalOpen(false)}
              className="px-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pwSaving}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {pwSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
