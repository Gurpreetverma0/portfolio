import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, ExternalLink, Calendar, FileText, Download, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ensureHttpsUrl, formatDate } from '../../utils/formatters';
import Modal from '../common/Modal';

export function AchievementsSection() {
  const { data } = usePortfolio();
  const achievements = data?.achievements || [];
  if (!achievements.length) return null;

  return (
    <section id="achievements" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">
            06 / Milestones & Honors
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            Achievements & Awards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="glass-card rounded-3xl overflow-hidden flex flex-col"
            >
              {item.image && (
                <img src={item.image} alt={item.title} className="w-full h-44 object-cover" />
              )}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold accent-text">
                      <Trophy className="w-3.5 h-3.5" />
                      {item.category}
                    </span>
                    <span className="text-xs text-zinc-500 inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{item.title}</h3>
                  {item.organization && (
                    <p className="text-xs font-medium text-zinc-500">{item.organization}</p>
                  )}
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.credentialUrl && (
                  <a
                    href={ensureHttpsUrl(item.credentialUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold accent-text hover:underline"
                  >
                    View Proof <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CertificatesSection() {
  const { data } = usePortfolio();
  const certificates = data?.certificates || [];
  const [selectedCert, setSelectedCert] = useState(null);

  if (!certificates.length) return null;

  return (
    <section id="certificates" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest accent-text mb-2">
            07 / Verified Credentials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
            Certifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, idx) => (
            <motion.div
              key={cert._id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => setSelectedCert(cert)}
              className="group cursor-pointer glass-card rounded-3xl overflow-hidden hover:border-indigo-500/40 transition flex flex-col"
            >
              {cert.fileUrl && cert.fileType !== 'pdf' ? (
                <div className="h-44 overflow-hidden bg-zinc-100 dark:bg-obsidian-800">
                  <img
                    src={cert.fileUrl}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
              ) : (
                <div className="h-44 bg-zinc-100 dark:bg-obsidian-800 flex flex-col items-center justify-center gap-2 text-zinc-500">
                  <FileText className="w-10 h-10 accent-text" />
                  <span className="text-xs font-medium">
                    {cert.fileType === 'pdf' ? 'PDF Certificate' : 'Verified Credential'}
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider accent-text">
                    {cert.category}
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-1 line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">{cert.issuingOrganization}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-200/70 dark:border-white/[0.06] text-xs text-zinc-500">
                  <span>Issued {formatDate(cert.issueDate)}</span>
                  <span className="font-semibold accent-text group-hover:underline">Inspect →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certificate Viewing Modal */}
      <Modal
        isOpen={Boolean(selectedCert)}
        onClose={() => setSelectedCert(null)}
        title={selectedCert?.title || ''}
        subtitle={
          selectedCert
            ? `${selectedCert.issuingOrganization} • Issued ${formatDate(selectedCert.issueDate)}`
            : ''
        }
        size="lg"
      >
        {selectedCert && (
          <div className="space-y-5">
            {selectedCert.fileUrl && (
              <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-obsidian-800">
                {selectedCert.fileType === 'pdf' ? (
                  <iframe
                    src={selectedCert.fileUrl}
                    title={selectedCert.title}
                    className="w-full h-[420px]"
                  />
                ) : (
                  <img
                    src={selectedCert.fileUrl}
                    alt={selectedCert.title}
                    className="w-full max-h-[450px] object-contain mx-auto"
                  />
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03]">
                <span className="text-zinc-500">Credential ID</span>
                <p className="font-mono font-semibold mt-0.5">
                  {selectedCert.credentialId || 'Not specified'}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.03]">
                <span className="text-zinc-500">Validity</span>
                <p className="font-semibold mt-0.5">
                  {selectedCert.expiryDate
                    ? `Expires ${formatDate(selectedCert.expiryDate)}`
                    : 'No Expiration'}
                </p>
              </div>
            </div>

            {selectedCert.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {selectedCert.description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              {selectedCert.fileUrl && (
                <a
                  href={selectedCert.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-white/5"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </a>
              )}
              {selectedCert.verificationUrl && (
                <a
                  href={ensureHttpsUrl(selectedCert.verificationUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl accent-bg text-white text-xs font-semibold hover:opacity-90"
                >
                  <CheckCircle className="w-4 h-4" />
                  Verify Credential
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
