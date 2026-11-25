import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { formatDate } from '../../utils/formatters';

export default function GallerySection() {
  const { data } = usePortfolio();
  const photos = data?.gallery || [];
  const [category, setCategory] = useState('All');
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(photos.map((p) => p.category).filter(Boolean)));
    return ['All', ...unique];
  }, [photos]);

  const filtered = useMemo(() => {
    if (category === 'All') return photos;
    return photos.filter((p) => p.category === category);
  }, [photos, category]);

  if (!photos.length) return null;

  const activePhoto = lightboxIdx !== null ? filtered[lightboxIdx] : null;

  return (
    <section id="gallery" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">
              08 / Visual Journal
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              Professional Gallery
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setLightboxIdx(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  category === cat
                    ? 'accent-bg text-white shadow-md'
                    : 'glass text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((photo, idx) => (
            <motion.button
              key={photo._id}
              type="button"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.2) }}
              onClick={() => setLightboxIdx(idx)}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden glass-card text-left"
            >
              <img
                src={photo.imageUrl}
                alt={photo.altText || photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition p-5 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/15 text-white backdrop-blur-md">
                    {photo.category}
                  </span>
                  <span className="p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{photo.title}</h3>
                  {photo.caption && (
                    <p className="text-xs text-zinc-300 line-clamp-1 mt-0.5">{photo.caption}</p>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length);
                  }}
                  className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx((lightboxIdx + 1) % filtered.length);
                  }}
                  className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full space-y-4 text-center"
            >
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.altText || activePhoto.title}
                className="max-h-[75vh] w-auto mx-auto rounded-2xl object-contain"
              />
              <div className="text-white space-y-1">
                <h3 className="text-lg font-bold">{activePhoto.title}</h3>
                {activePhoto.caption && (
                  <p className="text-sm text-zinc-300">{activePhoto.caption}</p>
                )}
                {activePhoto.description && (
                  <p className="text-xs text-zinc-400 max-w-2xl mx-auto">{activePhoto.description}</p>
                )}
                {activePhoto.dateTaken && (
                  <p className="text-[11px] text-zinc-500">{formatDate(activePhoto.dateTaken)}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
