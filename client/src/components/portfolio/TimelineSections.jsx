import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatDate } from '../../utils/formatters';
import { SectionEmpty } from '../common/Skeletons';

export function ExperienceSection() {
  const { data } = usePortfolio();
  const experiences = data?.experience || [];

  return (
    <section id="experience" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">04 / Career Path</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">Experience & Internships</h2>
        </div>

        {experiences.length === 0 ? (
          <SectionEmpty icon={Briefcase} title="Experience details coming soon" subtitle="Work experience and internships will appear here once added via Admin." />
        ) : (
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-card rounded-3xl p-6 sm:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    {exp.companyLogo ? (
                      <img src={exp.companyLogo} alt={exp.company} className="w-12 h-12 rounded-2xl object-cover border border-zinc-200 dark:border-white/10" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 accent-text flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{exp.position}</h3>
                      <p className="text-sm font-medium accent-text">
                        {exp.company}{' '}
                        {exp.employmentType ? <span className="text-zinc-500 font-normal">• {exp.employmentType}</span> : null}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(exp.startDate)} – {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </span>
                    {exp.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                {exp.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">{exp.description}</p>
                )}

                {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full accent-bg shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {Array.isArray(exp.techUsed) && exp.techUsed.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.techUsed.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-100 dark:bg-white/[0.06]">{tech}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function EducationSection() {
  const { data } = usePortfolio();
  const education = data?.education || [];

  return (
    <section id="education" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">05 / Academic Background</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">Education</h2>
        </div>

        {education.length === 0 ? (
          <SectionEmpty icon={GraduationCap} title="Education details coming soon" subtitle="Academic qualifications will appear here once added via Admin." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu, idx) => (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-card rounded-3xl p-6 sm:p-7 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 accent-text shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-white">{edu.degree}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {edu.fieldOfStudy ? `${edu.fieldOfStudy} • ` : ''}{edu.institution}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono glass shrink-0">
                    {edu.startYear} – {edu.isCurrent ? 'Present' : edu.endYear}
                  </span>
                </div>

                {edu.grade && <p className="text-xs font-semibold accent-text">Grade / CGPA: {edu.grade}</p>}
                {edu.description && <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{edu.description}</p>}

                {Array.isArray(edu.achievements) && edu.achievements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {edu.achievements.map((a, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-100 dark:bg-white/[0.06]">{a}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
