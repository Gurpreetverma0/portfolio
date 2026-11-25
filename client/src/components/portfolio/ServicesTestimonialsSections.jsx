import { motion } from 'framer-motion';
import { Check, Quote, Star } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { DynamicIcon } from '../../utils/formatters';

export function ServicesSection() {
  const { data } = usePortfolio();
  const services = data?.services || [];
  if (!services.length) return null;

  return (
    <section id="services" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">
            09 / Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            Services Offered
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => (
            <motion.div
              key={srv._id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="glass-card rounded-3xl p-7 flex flex-col justify-between space-y-6 hover:border-indigo-500/40 transition"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 accent-text flex items-center justify-center">
                  <DynamicIcon name={srv.icon} className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{srv.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {srv.shortDescription}
                </p>

                {Array.isArray(srv.features) && srv.features.length > 0 && (
                  <ul className="space-y-2 pt-2">
                    {srv.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                        <Check className="w-3.5 h-3.5 accent-text shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {(srv.deliveryTime || srv.startingPrice) && (
                <div className="pt-4 border-t border-zinc-200/70 dark:border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
                  {srv.deliveryTime && <span>Delivery: {srv.deliveryTime}</span>}
                  {srv.startingPrice && <span className="font-semibold accent-text">{srv.startingPrice}</span>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const { data } = usePortfolio();
  const testimonials = data?.testimonials || [];
  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">
            10 / Endorsements
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            Testimonials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="glass-card rounded-3xl p-7 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Quote className="w-7 h-7 accent-text opacity-50" />
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                  &ldquo;{t.feedback}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-200/70 dark:border-white/[0.06]">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500/15 accent-text flex items-center justify-center font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">
                    {t.role}
                    {t.company ? `, ${t.company}` : ''}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
