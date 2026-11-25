import { useCallback, useEffect, useState } from 'react';
import { Mail, Trash2, CheckCheck, Archive, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../services/api';
import { formatFullDate } from '../../utils/formatters';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getMessages({ status: statusFilter, search });
      setMessages(res.data.data || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(loadMessages, 200);
    return () => clearTimeout(t);
  }, [loadMessages]);

  const updateStatus = async (id, status) => {
    try {
      const res = await adminApi.updateMessage(id, { status });
      setMessages((prev) => prev.map((m) => (m._id === id ? res.data.data : m)));
      if (selected?._id === id) setSelected(res.data.data);
      loadMessages();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSelect = (msg) => {
    setSelected(msg);
    if (msg.status === 'unread') {
      updateStatus(msg._id, 'read');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteMessage(deleteTarget._id);
      toast.success('Message deleted');
      if (selected?._id === deleteTarget._id) setSelected(null);
      setDeleteTarget(null);
      loadMessages();
    } catch {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {unreadCount} unread message{unreadCount === 1 ? '' : 's'} in your inbox.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inbox..."
              className="pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-obsidian-850 border border-zinc-200 dark:border-white/10 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-obsidian-850 border border-zinc-200 dark:border-white/10 text-sm"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl divide-y divide-zinc-200/70 dark:divide-white/[0.06] overflow-hidden max-h-[600px] overflow-y-auto">
          {loading ? (
            <p className="p-8 text-center text-sm text-zinc-500">Loading inbox...</p>
          ) : messages.length === 0 ? (
            <p className="p-8 text-center text-sm text-zinc-500">Inbox is empty.</p>
          ) : (
            messages.map((m) => (
              <button
                key={m._id}
                type="button"
                onClick={() => handleSelect(m)}
                className={`w-full text-left p-4 hover:bg-zinc-50 dark:hover:bg-white/[0.03] transition ${
                  selected?._id === m._id ? 'bg-indigo-500/10' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm truncate">{m.name}</span>
                  {m.status === 'unread' && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate mt-1">
                  {m.subject}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">{formatFullDate(m.createdAt)}</p>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-3 glass-card rounded-2xl p-6 min-h-[360px]">
          {selected ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 dark:border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold">{selected.subject}</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    From <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selected.name}</span>{' '}
                    &lt;<a href={`mailto:${selected.email}`} className="text-indigo-500 hover:underline">{selected.email}</a>&gt; •{' '}
                    {formatFullDate(selected.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(selected._id, selected.status === 'read' ? 'unread' : 'read')
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark {selected.status === 'read' ? 'Unread' : 'Read'}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(selected._id, 'archived')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Archive
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(selected)}
                    className="p-1.5 rounded-xl text-red-500 hover:bg-red-500/10"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {selected.message}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-16">
              <Mail className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">Select a message to read its full content.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        message={`Delete message from "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
