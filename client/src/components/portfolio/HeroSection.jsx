import { motion } from 'framer-motion';
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  MapPin,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ensureHttpsUrl } from '../../utils/formatters';

const SOCIAL_META = [
  { key: 'github', label: 'GitHub', icon: Github },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'twitter', label: 'Twitter', icon: Twitter },
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'youtube', label: 'YouTube', icon: Youtube },
  { key: 'website', label: 'Website', icon: Globe },
];

export default function HeroSection() {
  const { data } = usePortfolio();
  const profile = data?.profile;
  if (!profile) return null;

  const socials = SOCIAL_META.filter((s) => profile.socialLinks?.[s.key]);

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
    >
      {/* Animated ambient grid & radial glow */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-32 opacity-60 dark:opacity-100 pointer-events-none" />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.22, 0.34, 0.22] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 left-1/4 w-[520px] h-[520px] rounded-full blur-[130px] pointer-events-none"
        style={{ backgroundColor: 'var(--accent-color, #6366f1)' }}
      />
      <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 space-y-6"
          >
            {profile.heroBadge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-xs font-medium text-zinc-700 dark:text-zinc-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{profile.heroBadge}</span>
              </div>
            )}

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                {profile.name}
              </h1>
              <p className="text-xl sm:text-2xl font-semibold accent-text">
                {profile.headline}
              </p>
            </div>

            {profile.shortBio && (
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
                {profile.shortBio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl accent-bg text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:opacity-90 transition"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={profile.resumeFilename || 'Resume.pdf'}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl glass text-sm font-semibold hover:border-indigo-500/40 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
              ) : (
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl glass text-sm font-semibold hover:border-indigo-500/40 transition"
                >
                  <span>Explore Projects</span>
                </a>
              )}
            </div>

            {/* Social Links & Location */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              {socials.map(({ key, label, icon: Icon }) => (
                <a
                  key={key}
                  href={ensureHttpsUrl(profile.socialLinks[key])}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="p-2.5 rounded-xl glass text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:scale-105 transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              {profile.location && (
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 pl-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </span>
              )}
            </div>
          </motion.div>

          {/* Profile Portrait & Highlights */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col items-center lg:items-end"
          >
            <div className="relative w-72 sm:w-80 lg:w-96">
              <div
                className="absolute -inset-1 rounded-[2rem] opacity-40 blur-2xl"
                style={{ backgroundColor: 'var(--accent-color, #6366f1)' }}
              />
              <div className="relative rounded-[2rem] overflow-hidden glass-card p-2">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-full aspect-[4/4.3] object-cover rounded-[1.5rem]"
                  />
                ) : (
                  <div className="w-full aspect-[4/4.3] rounded-[1.5rem] bg-zinc-200 dark:bg-obsidian-800 flex items-center justify-center text-5xl font-bold text-zinc-500">
                    {profile.name?.charAt(0)}
                  </div>
                )}

                {Array.isArray(profile.highlights) && profile.highlights.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 p-3 mt-1">
                    {profile.highlights.slice(0, 3).map((h, i) => (
                      <div
                        key={i}
                        className="text-center p-2 rounded-xl bg-zinc-100/80 dark:bg-white/[0.04]"
                      >
                        <p className="text-base font-bold text-zinc-900 dark:text-white">{h.value}</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                          {h.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
