import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Eye } from 'lucide-react';
import { publicApi } from '../services/api';
import Navbar from '../components/portfolio/Navbar';
import { Footer } from '../components/portfolio/BlogResumeContactFooter';
import MarkdownContent from '../components/common/MarkdownContent';
import { PageLoader } from '../components/common/Skeletons';
import { formatFullDate } from '../utils/formatters';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    publicApi.trackView(`/blog/${slug}`);
    setLoading(true);
    publicApi
      .getBlogBySlug(slug)
      .then((res) => {
        setPost(res.data.data);
        if (res.data.data?.title) document.title = res.data.data.title;
      })
      .catch(() => setError('Article not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <PageLoader />;

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-obsidian-950">
        <p className="text-lg font-semibold mb-4">{error || 'Article not found'}</p>
        <Link to="/" className="px-4 py-2 rounded-xl accent-bg text-white text-sm font-semibold">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-obsidian-950 text-zinc-900 dark:text-zinc-100">
      <Navbar />
      <main className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          to="/#blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 accent-text font-semibold">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatFullDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTimeMinutes || 4} min read
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {post.views || 0} views
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
        </div>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full max-h-[420px] object-cover rounded-3xl border border-zinc-200 dark:border-white/10"
          />
        )}

        <article className="glass-card rounded-3xl p-7 sm:p-10">
          <MarkdownContent content={post.content} />
        </article>

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-xl text-xs glass">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
