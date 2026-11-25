import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi, publicApi } from '../../services/api';
import ImageUploader from '../../components/common/ImageUploader';
import { usePortfolio } from '../../context/PortfolioContext';
import { parseListInput } from '../../utils/formatters';

export default function AdminProfile() {
  const { refreshPortfolio } = usePortfolio();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    headline: '',
    heroBadge: '',
    shortBio: '',
    fullBio: '',
    careerGoals: '',
    interestsText: '',
    email: '',
    phone: '',
    location: '',
    availabilityStatus: 'open',
    yearsOfExperience: '',
    profileImage: '',
    profileImagePublicId: '',
    resumeUrl: '',
    resumePublicId: '',
    resumeFilename: 'Resume.pdf',
    socialLinks: {
      github: '',
      linkedin: '',
      instagram: '',
      facebook: '',
      twitter: '',
      website: '',
      youtube: '',
    },
    highlights: [],
  });

  useEffect(() => {
    publicApi
      .getBootstrap()
      .then((res) => {
        const p = res.data.data?.profile;
        if (p) {
          setForm({
            ...p,
            interestsText: (p.interests || []).join(', '),
            socialLinks: {
              github: '',
              linkedin: '',
              instagram: '',
              facebook: '',
              twitter: '',
              website: '',
              youtube: '',
              ...(p.socialLinks || {}),
            },
            highlights: p.highlights || [],
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        interests: parseListInput(form.interestsText),
      };
      delete payload.interestsText;
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;

      await adminApi.updateProfile(payload);
      toast.success('Profile updated & synced to public site');
      refreshPortfolio();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-zinc-500">Loading profile...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Profile, Hero & Resume</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Changes automatically reflect on the public Hero, About, Resume, Contact, and Footer sections.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Media Uploads */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <ImageUploader
            label="Profile Photo"
            value={form.profileImage}
            publicId={form.profileImagePublicId}
            folder="profile"
            onChange={({ url, publicId }) =>
              setForm((f) => ({ ...f, profileImage: url, profileImagePublicId: publicId }))
            }
          />
          <ImageUploader
            label="Resume (PDF or Document)"
            value={form.resumeUrl}
            publicId={form.resumePublicId}
            accept="application/pdf,image/*"
            folder="resume"
            helperText="Upload PDF resume (replaces existing)"
            onChange={({ url, publicId, originalName }) =>
              setForm((f) => ({
                ...f,
                resumeUrl: url,
                resumePublicId: publicId,
                resumeFilename: originalName || f.resumeFilename || 'Resume.pdf',
              }))
            }
          />
        </div>

        {/* Core Identity & Bio */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold">Identity & Biography</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Professional Headline</label>
              <input
                type="text"
                required
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Hero Status Badge</label>
              <input
                type="text"
                value={form.heroBadge}
                onChange={(e) => setForm({ ...form, heroBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Availability</label>
              <select
                value={form.availabilityStatus}
                onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
              >
                <option value="open">Open to Opportunities</option>
                <option value="freelance">Available for Freelance</option>
                <option value="employed">Currently Employed</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Public Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Phone (Optional)</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Years of Experience</label>
              <input
                type="text"
                value={form.yearsOfExperience}
                onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Hero Short Introduction</label>
            <textarea
              rows={2}
              value={form.shortBio}
              onChange={(e) => setForm({ ...form, shortBio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Detailed Biography (About Me)</label>
            <textarea
              rows={4}
              value={form.fullBio}
              onChange={(e) => setForm({ ...form, fullBio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Career Goals</label>
            <textarea
              rows={2}
              value={form.careerGoals}
              onChange={(e) => setForm({ ...form, careerGoals: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Interests (comma separated)</label>
            <input
              type="text"
              value={form.interestsText}
              onChange={(e) => setForm({ ...form, interestsText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Social Media URLs */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold">Social Media & Web Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {['github', 'linkedin', 'instagram', 'facebook', 'twitter', 'website', 'youtube'].map((key) => (
            <div key={key}>
              <label className="block text-xs font-medium uppercase text-zinc-500 mb-1">{key}</label>
              <input
                type="text"
                value={form.socialLinks?.[key] || ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    socialLinks: { ...f.socialLinks, [key]: e.target.value },
                  }))
                }
                placeholder={`https://${key}.com/...`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
