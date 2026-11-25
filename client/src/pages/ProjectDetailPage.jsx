import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Calendar, Eye } from 'lucide-react';
import { publicApi } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import Navbar from '../components/portfolio/Navbar';
import { Footer } from '../components/portfolio/BlogResumeContactFooter';
import MarkdownContent from '../components/common/MarkdownContent';
import { PageLoader } from '../components/common/Skeletons';
import { ensureHttpsUrl, formatDate } from '../utils/formatters';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { data } = usePortfolio();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    publicApi.trackView(`/projects/${slug}`);
    setLoading(true);
    publicApi
      .getProjectBySlug(slug)
      .then((res) => {
        setProject(res.data.data);
        if (res.data.data?.title) {
          document.title = `${res.data.data.title} — Project Details`;
        }
      })
      .catch(() => setError('Project not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <PageLoader />;

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-obsidian-950">
        <p className="text-lg font-semibold mb-4">{error || 'Project not found'}</p>
        <Link to="/" className="px-4 py-2 rounded-xl accent-bg text-white text-sm font-semibold">
          Return Home
        </Link>
      </div>
    );
  }

  const related = (data?.projects || [])
    .filter((p) => p._id !== project._id && p.category === project.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-obsidian-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <main className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 accent-text font-semibold">
              {project.category}
            </span>
            {project.startDate && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(project.startDate)}
                {project.endDate ? ` – ${formatDate(project.endDate)}` : ''}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {project.views || 0} views
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">{project.title}</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveDemoUrl && (
              <a
                href={ensureHttpsUrl(project.liveDemoUrl)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl accent-bg text-white text-sm font-semibold"
              >
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={ensureHttpsUrl(project.githubUrl)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl glass text-sm font-semibold"
              >
                <Github className="w-4 h-4" /> Source Code
              </a>
            )}
          </div>
        </div>

        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full max-h-[480px] object-cover rounded-3xl border border-zinc-200 dark:border-white/10 shadow-2xl"
          />
        )}

        <div className="flex flex-wrap gap-2">
          {(project.techStack || []).map((t) => (
            <span
              key={t}
              className="px-3 py-1.5 rounded-xl text-xs font-medium glass"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="glass-card rounded-3xl p-7 sm:p-10">
          <MarkdownContent content={project.fullDescription} />
        </div>

        {Array.isArray(project.screenshots) && project.screenshots.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Project Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {project.screenshots.map((s, i) => (
                <img
                  key={i}
                  src={s.url}
                  alt={s.caption || `${project.title} screenshot ${i + 1}`}
                  className="w-full h-64 object-cover rounded-2xl border border-zinc-200 dark:border-white/10"
                />
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-white/10">
            <h2 className="text-xl font-bold">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link
                  key={p._id}
                  to={`/projects/${p.slug}`}
                  className="glass-card rounded-2xl p-5 hover:border-indigo-500/40 transition block"
                >
                  <h3 className="font-bold text-sm">{p.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1">{p.shortDescription}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
