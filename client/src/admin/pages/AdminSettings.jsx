import { useEffect, useState } from 'react';
import { Save, ArrowUp, ArrowDown, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi, publicApi } from '../../services/api';
import ImageUploader from '../../components/common/ImageUploader';
import { usePortfolio } from '../../context/PortfolioContext';

const ACCENT_PRESETS = ['#6366f1', '#10b981', '#0ea5e9', '#8b5cf6', '#f43f5e', '#f59e0b'];

export default function AdminSettings() {
  const { refreshPortfolio } = usePortfolio();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    publicApi
      .getBootstrap()
      .then((res) => setForm(res.data.data?.settings))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;
      await adminApi.updateSettings(payload);
      toast.success('Website settings saved');
      refreshPortfolio();
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const moveSection = (index, dir) => {
    const order = [...(form.sectionOrder || [])];
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    const [moved] = order.splice(index, 1);
    order.splice(target, 0, moved);
    setForm({ ...form, sectionOrder: order });
  };

  const handleExport = async () => {
    try {
      const res = await adminApi.exportJson();
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Backup downloaded');
    } catch {
      toast.error('Export failed');
    }
  };

  if (loading || !form) return <div className="py-12 text-center text-zinc-500">Loading settings...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Website Settings & SEO</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Configure SEO metadata, accent colors, section visibility, section order, and maintenance mode.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-white/5"
          >
            <Download className="w-4 h-4" />
            Backup JSON
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO & Branding */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold">SEO & Branding</h2>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Site Title</label>
            <input
              type="text"
              value={form.siteTitle || ''}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Logo Text</label>
            <input
              type="text"
              value={form.logoText || ''}
              onChange={(e) => setForm({ ...form, logoText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Meta Description</label>
            <textarea
              rows={3}
              value={form.metaDescription || ''}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
            />
          </div>
          <ImageUploader
            label="Website Logo Image (Optional)"
            value={form.logoUrl || ''}
            folder="branding"
            onChange={({ url }) => setForm({ ...form, logoUrl: url })}
          />
          <ImageUploader
            label="Favicon (Optional)"
            value={form.faviconUrl || ''}
            folder="branding"
            onChange={({ url }) => setForm({ ...form, faviconUrl: url })}
          />
        </div>

        {/* Theme & Operational Controls */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-semibold">Theme, Footer & Maintenance</h2>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">Accent Color</label>
            <div className="flex items-center gap-2.5">
              {ACCENT_PRESETS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setForm({ ...form, accentColor: hex })}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    form.accentColor === hex ? 'border-white scale-110 ring-2 ring-indigo-500' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
              <input
                type="color"
                value={form.accentColor || '#6366f1'}
                onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                className="w-9 h-9 rounded cursor-pointer bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Default Theme</label>
            <select
              value={form.defaultTheme || 'dark'}
              onChange={(e) => setForm({ ...form, defaultTheme: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
            >
              <option value="dark">Dark (Default)</option>
              <option value="light">Light</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Footer Tagline</label>
            <input
              type="text"
              value={form.footerText || ''}
              onChange={(e) => setForm({ ...form, footerText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Copyright Text</label>
            <input
              type="text"
              value={form.copyrightText || ''}
              onChange={(e) => setForm({ ...form, copyrightText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
            />
          </div>

          <div className="space-y-2.5 pt-2 border-t border-zinc-200 dark:border-white/10">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={Boolean(form.enableAnalytics)}
                onChange={(e) => setForm({ ...form, enableAnalytics: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600"
              />
              Enable privacy-friendly visitor analytics
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={Boolean(form.enableContactEmail)}
                onChange={(e) => setForm({ ...form, enableContactEmail: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600"
              />
              Send SMTP email notifications on contact messages
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-sm text-amber-500 font-medium">
              <input
                type="checkbox"
                checked={Boolean(form.maintenanceMode)}
                onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600"
              />
              Enable Website Maintenance Mode
            </label>
            {form.maintenanceMode && (
              <textarea
                rows={2}
                value={form.maintenanceMessage || ''}
                onChange={(e) => setForm({ ...form, maintenanceMessage: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Section Visibility & Ordering */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold">Section Visibility & Ordering</h2>
          <p className="text-xs text-zinc-500">
            Toggle sections on/off or reorder how they appear on the public landing page.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(form.sectionOrder || []).map((sectionKey, idx) => (
            <div
              key={sectionKey}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10"
            >
              <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium capitalize">
                <input
                  type="checkbox"
                  checked={form.visibleSections?.[sectionKey] !== false}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      visibleSections: {
                        ...form.visibleSections,
                        [sectionKey]: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>{sectionKey}</span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, -1)}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-white/10 disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === form.sectionOrder.length - 1}
                  onClick={() => moveSection(idx, 1)}
                  className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-white/10 disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
