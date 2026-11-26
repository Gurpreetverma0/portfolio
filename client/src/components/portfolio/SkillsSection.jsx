import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { DynamicIcon } from '../../utils/formatters';
import { SectionEmpty } from '../common/Skeletons';

export default function SkillsSection() {
  const { data } = usePortfolio();
  const skills = data?.skills || [];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(skills.map((s) => s.category).filter(Boolean)));
    return ['All', ...unique];
  }, [skills]);

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return skills;
    return skills.filter((s) => s.category === selectedCategory);
  }, [skills, selectedCategory]);

  return (
    <section id="skills" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">
              02 / Technical Arsenal
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              Skills & Technologies
            </h2>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'accent-bg text-white shadow-md'
                      : 'glass text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {skills.length === 0 ? (
          <SectionEmpty
            icon={Cpu}
            title="Skills coming soon"
            subtitle="Technical skills and proficiency levels will be displayed here once added via Admin."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((skill, idx) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.25) }}
                className="glass-card rounded-2xl p-5 hover:border-indigo-500/40 transition group"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 accent-text group-hover:scale-110 transition">
                      <DynamicIcon name={skill.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">
                        {skill.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500">
                        {skill.category}
                        {skill.yearsOfExperience ? ` • ${skill.yearsOfExperience}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold accent-text">{skill.level}%</span>
                </div>

                <div className="h-2 rounded-full bg-zinc-200 dark:bg-white/[0.07] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full accent-bg"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
