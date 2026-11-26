import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Github, ExternalLink, ArrowRight, Star, FolderKanban } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ensureHttpsUrl } from '../../utils/formatters';
import { SectionEmpty } from '../common/Skeletons';

export default function ProjectsSection() {
  const { data } = usePortfolio();
  const projects = data?.projects || [];
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    return ['All', ...cats];
  }, [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = projects.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.shortDescription || '').toLowerCase().includes(q) ||
        (p.techStack || []).some((t) => t.toLowerCase().includes(q))
      );
    });

    if (sortBy === 'newest') {
      list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'title') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }
    return list;
  }, [projects, category, search, sortBy]);

  return (
    <section id="projects" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">
              03 / Selected Work
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              Featured Projects
            </h2>
          </div>

          {projects.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects or stack..."
                  className="pl-9 pr-3.5 py-2 rounded-xl glass text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl glass text-sm bg-white dark:bg-obsidian-900"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest</option>
                <option value="title">A–Z</option>
              </select>
            </div>
          )}
        </div>

        {projects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  category === cat
                    ? 'accent-bg text-white shadow-md'
                    : 'glass text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {projects.length === 0 ? (
          <SectionEmpty
            icon={FolderKanban}
            title="Projects coming soon"
            subtitle="Showcase projects will appear here once added via the Admin Dashboard."
          />
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center text-zinc-500">
            No projects match your current filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, idx) => (
              <motion.article
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.25) }}
                className="group glass-card rounded-3xl overflow-hidden flex flex-col hover:border-indigo-500/40 transition"
              >
                <Link to={`/projects/${project.slug}`} className="relative h-48 overflow-hidden block">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600/10 to-violet-600/10 dark:from-indigo-600/20 dark:to-violet-600/20 flex items-center justify-center">
                      <FolderKanban className="w-10 h-10 text-indigo-500/50" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {project.category && (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-black/70 text-white backdrop-blur-md">
                        {project.category}
                      </span>
                    )}
                    {project.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/90 text-black">
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="text-lg font-bold text-zinc-900 dark:text-white group-hover:accent-text transition line-clamp-1 block"
                    >
                      {project.title}
                    </Link>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(project.techStack || []).slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-100 dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-200/70 dark:border-white/[0.07]">
                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={ensureHttpsUrl(project.githubUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
                            title="GitHub Repo"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.liveDemoUrl && (
                          <a
                            href={ensureHttpsUrl(project.liveDemoUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <Link
                        to={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold accent-text hover:underline"
                      >
                        Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
