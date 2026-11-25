import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, X, Search, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';
import Modal from '../common/Modal';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const settings = data?.settings;
  const navLinks = (settings?.navbarLinks || [
    { label: 'About', href: '#about', visible: true },
    { label: 'Skills', href: '#skills', visible: true },
    { label: 'Projects', href: '#projects', visible: true },
    { label: 'Experience', href: '#experience', visible: true },
    { label: 'Certificates', href: '#certificates', visible: true },
    { label: 'Gallery', href: '#gallery', visible: true },
    { label: 'Blog', href: '#blog', visible: true },
    { label: 'Contact', href: '#contact', visible: true },
  ]).filter((l) => l.visible !== false);

  const q = query.trim().toLowerCase();
  const matchedProjects = q
    ? (data?.projects || []).filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.techStack || []).some((t) => t.toLowerCase().includes(q))
      )
    : [];
  const matchedBlogs = q
    ? (data?.blogs || []).filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q)
      )
    : [];
  const matchedCerts = q
    ? (data?.certificates || []).filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.issuingOrganization.toLowerCase().includes(q)
      )
    : [];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-white/80 dark:bg-obsidian-950/80 backdrop-blur-xl border-b border-zinc-200/70 dark:border-white/[0.08]'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <a href="#hero" className="flex items-center gap-2.5 font-display font-bold text-xl tracking-tight">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
            ) : (
              <span className="text-zinc-900 dark:text-white">
                {settings?.logoText || 'GV.'}
              </span>
            )}
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-white/5 transition"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              title="Search portfolio (Ctrl+K)"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] rounded bg-zinc-200/70 dark:bg-white/10">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/admin/dashboard"
              title="Admin CMS"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-white/10 hover:border-indigo-500/50 transition"
            >
              <Shield className="w-3.5 h-3.5 accent-text" />
              <span>Admin</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden p-2.5 rounded-xl border border-zinc-200 dark:border-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden mt-3 mx-4 p-4 rounded-2xl glass shadow-2xl space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold accent-text"
            >
              Admin Dashboard
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <Modal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Search Portfolio"
        subtitle="Search across projects, articles, and certifications"
        size="md"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a keyword, tech stack, or topic..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {!q ? (
            <p className="text-xs text-zinc-500 text-center py-6">
              Try searching &ldquo;React&rdquo;, &ldquo;Security&rdquo;, &ldquo;MongoDB&rdquo;, or a certificate name.
            </p>
          ) : matchedProjects.length + matchedBlogs.length + matchedCerts.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-6">No matching results found.</p>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {matchedProjects.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    Projects
                  </p>
                  <div className="space-y-1.5">
                    {matchedProjects.map((p) => (
                      <Link
                        key={p._id}
                        to={`/projects/${p.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="block p-3 rounded-xl bg-zinc-50 dark:bg-white/5 hover:bg-indigo-500/10 transition"
                      >
                        <p className="text-sm font-semibold">{p.title}</p>
                        <p className="text-xs text-zinc-500 truncate">{p.shortDescription}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {matchedBlogs.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    Articles
                  </p>
                  <div className="space-y-1.5">
                    {matchedBlogs.map((b) => (
                      <Link
                        key={b._id}
                        to={`/blog/${b.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="block p-3 rounded-xl bg-zinc-50 dark:bg-white/5 hover:bg-indigo-500/10 transition"
                      >
                        <p className="text-sm font-semibold">{b.title}</p>
                        <p className="text-xs text-zinc-500 truncate">{b.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {matchedCerts.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    Certificates
                  </p>
                  <div className="space-y-1.5">
                    {matchedCerts.map((c) => (
                      <a
                        key={c._id}
                        href="#certificates"
                        onClick={() => setSearchOpen(false)}
                        className="block p-3 rounded-xl bg-zinc-50 dark:bg-white/5 hover:bg-indigo-500/10 transition"
                      >
                        <p className="text-sm font-semibold">{c.title}</p>
                        <p className="text-xs text-zinc-500">{c.issuingOrganization}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
