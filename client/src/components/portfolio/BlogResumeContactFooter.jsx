import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  FileText,
  Download,
  Eye,
  Send,
  Mail,
  MapPin,
  ArrowUp,
  Github,
  Linkedin,
  Globe,
  Twitter,
  Instagram,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { usePortfolio } from '../../context/PortfolioContext';
import { publicApi } from '../../services/api';
import { ensureHttpsUrl, formatFullDate } from '../../utils/formatters';
import Modal from '../common/Modal';

export function BlogSection() {
  const { data } = usePortfolio();
  const blogs = data?.blogs || [];
  if (!blogs.length) return null;

  return (
    <section id="blog" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">
            11 / Technical Writing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            Blog & Articles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((post, idx) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group glass-card rounded-3xl overflow-hidden flex flex-col"
            >
              {post.coverImage && (
                <Link to={`/blog/${post.slug}`} className="h-44 overflow-hidden block">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </Link>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="font-semibold accent-text">{post.category}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTimeMinutes || 4} min read
                    </span>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-lg font-bold text-zinc-900 dark:text-white group-hover:accent-text transition line-clamp-2 block"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-200/70 dark:border-white/[0.06] text-xs">
                  <span className="text-zinc-500">
                    {formatFullDate(post.publishedAt || post.createdAt)}
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 font-semibold accent-text hover:underline"
                  >
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResumeSection() {
  const { data } = usePortfolio();
  const profile = data?.profile;
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!profile?.resumeUrl) return null;

  return (
    <section id="resume" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 accent-text shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest accent-text">
                Curriculum Vitae
              </p>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                Resume & Full Credentials
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Preview my latest resume directly in browser or download a copy.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl glass text-sm font-semibold hover:border-indigo-500/40 transition"
            >
              <Eye className="w-4 h-4" />
              Preview Resume
            </button>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              download={profile.resumeFilename || 'Resume.pdf'}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl accent-bg text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:opacity-90 transition"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </div>
        </div>
      </div>

      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Resume Preview"
        size="xl"
      >
        <iframe
          src={profile.resumeUrl}
          title="Resume PDF"
          className="w-full h-[70vh] rounded-xl border border-zinc-200 dark:border-white/10"
        />
      </Modal>
    </section>
  );
}

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
});

export function ContactSection() {
  const { data } = usePortfolio();
  const profile = data?.profile;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || 'Please check your inputs');
      return;
    }

    setSending(true);
    try {
      const res = await publicApi.submitContact(parsed.data);
      toast.success(res.data.message || 'Message sent!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">
            12 / Connect
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            Let&apos;s Build Something Impactful
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-5">
            <div className="glass-card rounded-3xl p-7 space-y-5">
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Have an engineering role, security audit, freelance project, or collaboration in mind? Send a message directly—every inquiry is persisted securely and reviewed promptly.
              </p>

              <div className="space-y-3 text-sm">
                {profile?.email && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 accent-text">
                      <Mail className="w-4 h-4" />
                    </div>
                    <a href={`mailto:${profile.email}`} className="hover:underline">
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 accent-text">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 glass-card rounded-3xl p-7 sm:p-8 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Alex Rivera"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="alex@company.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Project collaboration or role inquiry"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Message</label>
              <textarea
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project, timeline, or opportunity..."
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl accent-bg text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:opacity-90 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending Message...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { data } = usePortfolio();
  const settings = data?.settings;
  const profile = data?.profile;

  const socials = [
    { key: 'github', icon: Github },
    { key: 'linkedin', icon: Linkedin },
    { key: 'twitter', icon: Twitter },
    { key: 'instagram', icon: Instagram },
    { key: 'website', icon: Globe },
  ].filter((s) => profile?.socialLinks?.[s.key]);

  return (
    <footer className="border-t border-zinc-200/80 dark:border-white/[0.08] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-display font-bold text-lg text-zinc-900 dark:text-white">
            {settings?.logoText || profile?.name || 'Portfolio'}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {settings?.footerText || 'Engineered with security, performance, and craft.'}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            {settings?.copyrightText || `© ${new Date().getFullYear()} ${profile?.name || ''}. All rights reserved.`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {socials.map(({ key, icon: Icon }) => (
            <a
              key={key}
              href={ensureHttpsUrl(profile.socialLinks[key])}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl glass text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}

          <a
            href="#hero"
            title="Back to top"
            className="p-2.5 rounded-xl accent-bg text-white hover:opacity-90 transition"
          >
            <ArrowUp className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
