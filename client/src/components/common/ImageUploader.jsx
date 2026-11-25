import { useEffect, useRef, useState } from 'react';
import { UploadCloud, X, FileText, AlertCircle, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../services/api';

export default function ImageUploader({
  label = 'Upload Image',
  value = '',
  publicId = '',
  onChange,
  onMultipleChange,
  multiple = false,
  accept = 'image/*',
  folder = 'uploads',
  helperText = 'Drag & drop or click to upload (max 10MB)',
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cloudinaryReady, setCloudinaryReady] = useState(true);
  const [configMsg, setConfigMsg] = useState('');

  useEffect(() => {
    adminApi
      .getUploadStatus()
      .then((res) => {
        setCloudinaryReady(res.data.data.configured);
        setConfigMsg(res.data.data.message);
      })
      .catch(() => {});
  }, []);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setUploading(true);
    setProgress(10);

    try {
      if (multiple) {
        const res = await adminApi.uploadMultiple(files, folder, setProgress);
        onMultipleChange?.(res.data.data);
        toast.success(`Uploaded ${res.data.data.length} image(s)`);
      } else {
        const res = await adminApi.uploadSingle(files[0], folder, setProgress);
        onChange?.(res.data.data);
        toast.success('File uploaded to Cloudinary');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed';
      toast.error(msg);
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (publicId) {
      const isPdf = value?.toLowerCase().includes('.pdf') || value?.includes('/raw/');
      await adminApi.deleteFile(publicId, isPdf ? 'raw' : 'image').catch(() => {});
    }
    onChange?.({ url: '', publicId: '', fileType: 'image' });
  };

  const isPdf = value?.toLowerCase().endsWith('.pdf') || value?.includes('/raw/');

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </label>
      )}

      {!cloudinaryReady && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Cloudinary Setup Required</p>
            <p className="opacity-90 mt-0.5">{configMsg} You can still paste an image URL below.</p>
          </div>
        </div>
      )}

      {!multiple && value ? (
        <div className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-obsidian-800">
          {isPdf ? (
            <div className="flex items-center gap-3 p-4">
              <FileText className="w-8 h-8 text-indigo-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                  Uploaded PDF Document
                </p>
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-500 hover:underline truncate block"
                >
                  {value}
                </a>
              </div>
            </div>
          ) : (
            <img src={value} alt="Preview" className="w-full h-44 object-cover" />
          )}
          <button
            type="button"
            onClick={handleRemove}
            title="Remove file"
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white hover:bg-red-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition ${
          dragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-zinc-300 dark:border-white/15 hover:border-indigo-500/60 bg-zinc-50/70 dark:bg-white/[0.02]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
            {uploading ? (
              <UploadCloud className="w-5 h-5 animate-bounce" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
          </div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {uploading ? `Uploading... ${progress}%` : helperText}
          </p>
        </div>
        {uploading && (
          <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {!multiple && onChange && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange({ url: e.target.value, publicId: '' })}
          placeholder="Or paste direct image/document URL..."
          className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-obsidian-800 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-indigo-500"
        />
      )}
    </div>
  );
}
