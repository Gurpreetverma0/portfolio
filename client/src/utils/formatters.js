import { createElement } from 'react';
import * as Icons from 'lucide-react';

export const formatDate = (dateStr, options = { month: 'short', year: 'numeric' }) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', options);
};

export const formatFullDate = (dateStr) =>
  formatDate(dateStr, { month: 'short', day: 'numeric', year: 'numeric' });

export const ensureHttpsUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const DynamicIcon = ({ name = 'Code2', className = 'w-5 h-5' }) => {
  const IconComponent = Icons[name] || Icons.Code2;
  return createElement(IconComponent, { className });
};

export const parseListInput = (str) =>
  String(str || '')
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

export const parseLinesInput = (str) =>
  String(str || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
