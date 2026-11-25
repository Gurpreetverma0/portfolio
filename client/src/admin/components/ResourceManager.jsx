import { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../services/api';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ImageUploader from '../../components/common/ImageUploader';
import { usePortfolio } from '../../context/PortfolioContext';
import { parseLinesInput, parseListInput } from '../../utils/formatters';

/**
 * Reusable full-featured CRUD manager for any portfolio module.
 * Supports search, category & status filtering, sorting, pagination,
 * reordering, featured toggle, publish/unpublish, preview, and Cloudinary uploads.
 */
export default function ResourceManager({
  module,
  title,
  subtitle,
  singularName,
  fields,
  columns,
  categories = [],
  hiddenStatus = 'draft',
  supportsFeatured = true,
  supportsBulkGalleryUpload = false,
  renderPreview,
}) {
  const { refreshPortfolio } = usePortfolio();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sort, setSort] = useState('order');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formState, setFormState] = useState({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [previewItem, setPreviewItem] = useState(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const fetchItems = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await adminApi.list(module, {
          page,
          limit: 12,
          search,
          status: statusFilter,
          category: categoryFilter,
          sort,
        });
        setItems(res.data.data || []);
        setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
      } catch (err) {
        toast.error(err.response?.data?.message || `Failed to load ${title}`);
      } finally {
        setLoading(false);
      }
    },
    [module, search, statusFilter, categoryFilter, sort, title]
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchItems(1), 200);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const buildInitialForm = (item = null) => {
    const state = {};
    fields.forEach((f) => {
      if (item) {
        let val = item[f.name];
        if (f.type === 'date' && val) {
          val = new Date(val).toISOString().slice(0, 10);
        } else if (f.type === 'tags' && Array.isArray(val)) {
          val = val.join(', ');
        } else if (f.type === 'lines' && Array.isArray(val)) {
          val = val.join('\n');
        }
        state[f.name] = val ?? f.defaultValue ?? '';
        if (f.publicIdField) {
          state[f.publicIdField] = item[f.publicIdField] || '';
        }
      } else {
        state[f.name] = f.defaultValue ?? (f.type === 'checkbox' ? false : f.type === 'number' ? 0 : '');
        if (f.publicIdField) state[f.publicIdField] = '';
      }
    });
    return state;
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormState(buildInitialForm(null));
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormState(buildInitialForm(item));
    setModalOpen(true);
  };

  const handleSave = async (e, overrideStatus = null) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const payload = {};
      fields.forEach((f) => {
        let val = formState[f.name];
        if (f.type === 'tags') {
          val = parseListInput(val);
        } else if (f.type === 'lines') {
          val = parseLinesInput(val);
        } else if (f.type === 'number') {
          val = val === '' || val === null ? undefined : Number(val);
        } else if (f.type === 'date') {
          val = val ? val : null;
        }
        if (val !== undefined) payload[f.name] = val;
        if (f.publicIdField && formState[f.publicIdField] !== undefined) {
          payload[f.publicIdField] = formState[f.publicIdField];
        }
      });

      if (overrideStatus) {
        payload.status = overrideStatus;
      }

      if (editingItem) {
        await adminApi.update(module, editingItem._id, payload);
        toast.success(`${singularName} updated`);
      } else {
        await adminApi.create(module, payload);
        toast.success(`${singularName} created`);
      }
      setModalOpen(false);
      await fetchItems(pagination.page);
      refreshPortfolio();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to save ${singularName}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.remove(module, deleteTarget._id);
      toast.success(`${singularName} deleted`);
      setDeleteTarget(null);
      await fetchItems(pagination.page);
      refreshPortfolio();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const res = await adminApi.toggleStatus(module, item._id);
      toast.success(res.data.message);
      await fetchItems(pagination.page);
      refreshPortfolio();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleToggleFeatured = async (item) => {
    try {
      const res = await adminApi.toggleFeatured(module, item._id);
      toast.success(res.data.message);
      await fetchItems(pagination.page);
      refreshPortfolio();
    } catch {
      toast.error('Failed to update featured flag');
    }
  };

  const handleMove = async (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);

    const payload = reordered.map((item, idx) => ({
      id: item._id,
      displayOrder: idx + 1,
    }));
    setItems(reordered);
    try {
      await adminApi.reorder(module, payload);
      toast.success('Order saved');
      refreshPortfolio();
    } catch {
      toast.error('Failed to save order');
      fetchItems(pagination.page);
    }
  };

  const handleBulkGalleryCreate = async (uploadedList) => {
    try {
      await Promise.all(
        uploadedList.map((u, idx) =>
          adminApi.create('gallery', {
            title: u.originalName?.replace(/\.[^/.]+$/, '') || `Photo ${idx + 1}`,
            imageUrl: u.url,
            publicId: u.publicId,
            altText: u.originalName || 'Portfolio photo',
            category: 'Events',
            status: 'published',
          })
        )
      );
      toast.success(`Added ${uploadedList.length} gallery photo(s)`);
      setBulkUploadOpen(false);
      fetchItems(1);
      refreshPortfolio();
    } catch {
      toast.error('Failed to save uploaded photos');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{title}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2.5">
          {supportsBulkGalleryUpload && (
            <button
              type="button"
              onClick={() => setBulkUploadOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-indigo-500/40 text-indigo-500 hover:bg-indigo-500/10 text-sm font-semibold transition"
            >
              Bulk Upload Photos
            </button>
          )}
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add {singularName}</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value={hiddenStatus}>{hiddenStatus === 'hidden' ? 'Hidden' : 'Draft'}</option>
        </select>

        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
        >
          <option value="order">Display Order</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="featured">Featured First</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-white/10 text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <th className="py-3.5 px-4">Order</th>
                {columns.map((col) => (
                  <th key={col.key} className="py-3.5 px-4">
                    {col.label}
                  </th>
                ))}
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/70 dark:divide-white/[0.06] text-sm">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 3} className="py-12 text-center text-zinc-500">
                    Loading records...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 3} className="py-12 text-center text-zinc-500">
                    No {title.toLowerCase()} found. Click &ldquo;Add {singularName}&rdquo; to create one.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr
                    key={item._id}
                    className="hover:bg-zinc-50/70 dark:hover:bg-white/[0.02] transition"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-white/10 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 1)}
                          disabled={idx === items.length - 1}
                          className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-white/10 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="py-3 px-4 max-w-xs">
                        {col.render ? col.render(item) : item[col.key] || '—'}
                      </td>
                    ))}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
                          item.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25'
                        }`}
                      >
                        {item.status === 'published' ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        <span className="capitalize">{item.status}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        {supportsFeatured && (
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(item)}
                            title={item.isFeatured ? 'Unfeature' : 'Mark as featured'}
                            className={`p-1.5 rounded-lg transition ${
                              item.isFeatured
                                ? 'text-amber-500 bg-amber-500/10'
                                : 'text-zinc-400 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-white/10'
                            }`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        )}
                        {renderPreview && (
                          <button
                            type="button"
                            onClick={() => setPreviewItem(item)}
                            title="Preview"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-white/10 transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          title="Edit"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-white/10 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between text-xs text-zinc-500">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => fetchItems(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchItems(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-white/10 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? `Edit ${singularName}` : `Create ${singularName}`}
        size="lg"
      >
        <form onSubmit={(e) => handleSave(e)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => {
              const spanFull =
                f.fullWidth ||
                ['textarea', 'image', 'asset', 'multiImage', 'lines'].includes(f.type);
              return (
                <div key={f.name} className={spanFull ? 'md:col-span-2' : ''}>
                  {f.type === 'image' || f.type === 'asset' ? (
                    <ImageUploader
                      label={f.label}
                      value={formState[f.name] || ''}
                      publicId={f.publicIdField ? formState[f.publicIdField] : ''}
                      accept={f.type === 'asset' ? 'image/*,application/pdf' : 'image/*'}
                      folder={module}
                      onChange={({ url, publicId, fileType }) =>
                        setFormState((prev) => ({
                          ...prev,
                          [f.name]: url,
                          ...(f.publicIdField ? { [f.publicIdField]: publicId } : {}),
                          ...(f.fileTypeField && fileType ? { [f.fileTypeField]: fileType } : {}),
                        }))
                      }
                    />
                  ) : f.type === 'multiImage' ? (
                    <div className="space-y-3">
                      <ImageUploader
                        label={f.label}
                        multiple
                        folder={module}
                        helperText="Drop multiple screenshots to attach"
                        onMultipleChange={(uploaded) =>
                          setFormState((prev) => ({
                            ...prev,
                            [f.name]: [...(prev[f.name] || []), ...uploaded],
                          }))
                        }
                      />
                      {Array.isArray(formState[f.name]) && formState[f.name].length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {formState[f.name].map((img, i) => (
                            <div
                              key={i}
                              className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10"
                            >
                              <img src={img.url} alt="" className="w-full h-24 object-cover" />
                              <button
                                type="button"
                                onClick={() =>
                                  setFormState((prev) => ({
                                    ...prev,
                                    [f.name]: prev[f.name].filter((_, idx) => idx !== i),
                                  }))
                                }
                                className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-white hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : f.type === 'checkbox' ? (
                    <label className="inline-flex items-center gap-2.5 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={Boolean(formState[f.name])}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, [f.name]: e.target.checked }))
                        }
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                        {f.label}
                      </span>
                    </label>
                  ) : f.type === 'select' ? (
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                        {f.label}
                      </label>
                      <select
                        value={formState[f.name] ?? ''}
                        required={f.required}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, [f.name]: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm"
                      >
                        {f.options.map((opt) => (
                          <option key={opt.value ?? opt} value={opt.value ?? opt}>
                            {opt.label ?? opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : f.type === 'textarea' || f.type === 'lines' ? (
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                        {f.label}
                      </label>
                      <textarea
                        rows={f.rows || 4}
                        required={f.required}
                        value={formState[f.name] ?? ''}
                        placeholder={f.placeholder || ''}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, [f.name]: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                        {f.label}
                      </label>
                      <input
                        type={f.type || 'text'}
                        required={f.required}
                        min={f.min}
                        max={f.max}
                        value={formState[f.name] ?? ''}
                        placeholder={f.placeholder || ''}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, [f.name]: e.target.value }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-zinc-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(null, hiddenStatus)}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-zinc-200 dark:bg-white/10 text-zinc-800 dark:text-zinc-200 hover:opacity-90"
            >
              Save as {hiddenStatus === 'hidden' ? 'Hidden' : 'Draft'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Save & Publish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Bulk Gallery Upload Modal */}
      {supportsBulkGalleryUpload && (
        <Modal
          isOpen={bulkUploadOpen}
          onClose={() => setBulkUploadOpen(false)}
          title="Bulk Upload Gallery Photos"
          subtitle="Upload multiple photos to Cloudinary and auto-publish them to your Gallery"
          size="md"
        >
          <ImageUploader
            label="Select or Drop Multiple Photos"
            multiple
            folder="gallery"
            helperText="Drag & drop up to 15 photos at once"
            onMultipleChange={handleBulkGalleryCreate}
          />
        </Modal>
      )}

      {/* Preview Modal */}
      {renderPreview && (
        <Modal
          isOpen={Boolean(previewItem)}
          onClose={() => setPreviewItem(null)}
          title={`Preview: ${previewItem?.title || previewItem?.name || ''}`}
          size="lg"
        >
          {previewItem && renderPreview(previewItem)}
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Are you sure you want to delete "${
          deleteTarget?.title || deleteTarget?.name || deleteTarget?.company || deleteTarget?.institution || 'this item'
        }"?`}
      />
    </div>
  );
}
