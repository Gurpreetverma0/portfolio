import { motion } from 'framer-motion';
import { Compass, Heart, Mail, MapPin, Briefcase, User } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SectionEmpty } from '../common/Skeletons';

export default function AboutSection() {
  const { data } = usePortfolio();
  const profile = data?.profile;

  if (!profile?.fullBio && !profile?.shortBio) {
    return (
      <section id="about" className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">01 / About Me</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">About Me</h2>
          </div>
          <SectionEmpty icon={User} title="About section coming soon" subtitle="Profile details will appear here once configured via Admin Dashboard." />
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          <div className="max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">01 / About Me</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              {profile.aboutTitle || 'Engineering with Clarity & Security'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 glass-card rounded-3xl p-7 sm:p-8 space-y-5">
              <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {profile.fullBio || profile.shortBio}
              </p>

              {profile.careerGoals && (
                <div className="pt-4 border-t border-zinc-200 dark:border-white/10">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white mb-1.5">
                    <Compass className="w-4 h-4 accent-text" />
                    <span>Career Focus & Goals</span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {profile.careerGoals}
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card rounded-3xl p-7 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Professional Snapshot
                </h3>
                <div className="space-y-3 text-sm">
                  {profile.email && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-indigo-500/10 accent-text shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <a href={`mailto:${profile.email}`} className="hover:underline truncate">{profile.email}</a>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-indigo-500/10 accent-text shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.yearsOfExperience && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-indigo-500/10 accent-text shrink-0">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span>{profile.yearsOfExperience} Years Building Systems</span>
                    </div>
                  )}
                </div>
              </div>

              {Array.isArray(profile.interests) && profile.interests.length > 0 && (
                <div className="glass-card rounded-3xl p-7 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    <Heart className="w-4 h-4 accent-text" />
                    <span>Core Interests</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 dark:bg-white/[0.06] text-zinc-700 dark:text-zinc-200 border border-zinc-200/70 dark:border-white/[0.08]"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
