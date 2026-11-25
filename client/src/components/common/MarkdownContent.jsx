import React from 'react';

/**
 * Lightweight safe renderer for markdown-style headings, lists, code, and paragraphs.
 */
export default function MarkdownContent({ content = '' }) {
  const lines = String(content).split('\n');

  const formatInline = (text) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 font-mono text-xs text-indigo-600 dark:text-indigo-300"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-zinc-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-3 text-zinc-700 dark:text-zinc-300 leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={i} className="text-lg font-bold text-zinc-900 dark:text-white pt-2">
              {formatInline(trimmed.slice(4))}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={i} className="text-2xl font-bold text-zinc-900 dark:text-white pt-3">
              {formatInline(trimmed.slice(3))}
            </h2>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={i} className="text-3xl font-bold text-zinc-900 dark:text-white pt-4">
              {formatInline(trimmed.slice(2))}
            </h1>
          );
        }
        if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
          const text = trimmed.replace(/^([-*]|\d+\.)\s+/, '');
          return (
            <div key={i} className="flex items-start gap-2.5 pl-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              <span>{formatInline(text)}</span>
            </div>
          );
        }
        return <p key={i}>{formatInline(trimmed)}</p>;
      })}
    </div>
  );
}
