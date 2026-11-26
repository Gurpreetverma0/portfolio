import { createElement } from 'react';
import {
  Code2,
  Terminal,
  Layers,
  Palette,
  Server,
  KeyRound,
  Database,
  HardDrive,
  ShieldCheck,
  Shield,
  Wrench,
  Globe,
  Cpu,
  Layout,
  FileCode,
  Zap,
  Smartphone,
  Cloud,
  GitBranch,
  Lock,
  Activity,
  Monitor,
  Compass,
  Sparkles,
  Folder,
  FolderKanban,
  Rocket,
  Briefcase,
  Award,
  Trophy,
  Box,
  Check,
  Star,
  CheckCircle,
  Mail,
  MapPin,
  Eye,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  ArrowRight,
  ArrowUp,
  Download,
  Search,
  Clock,
  BookOpen,
  PenTool,
  Bookmark,
  Bug,
  Braces,
  Binary,
  Workflow,
  Radio,
  Wifi,
  Package,
  Boxes,
  Container,
  Flame,
  Settings,
  Sliders,
  Share2,
  Send,
  MessageSquare,
  MessageSquareQuote,
  Quote,
  GraduationCap,
  Images,
  FileText,
  HelpCircle,
} from 'lucide-react';

const ICON_MAP = {
  Code2,
  Terminal,
  Layers,
  Palette,
  Server,
  KeyRound,
  Database,
  HardDrive,
  ShieldCheck,
  Shield,
  Wrench,
  Globe,
  Cpu,
  Layout,
  FileCode,
  Zap,
  Smartphone,
  Cloud,
  GitBranch,
  Lock,
  Activity,
  Monitor,
  Compass,
  Sparkles,
  Folder,
  FolderKanban,
  Rocket,
  Briefcase,
  Award,
  Trophy,
  Box,
  Check,
  Star,
  CheckCircle,
  Mail,
  MapPin,
  Eye,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  ArrowRight,
  ArrowUp,
  Download,
  Search,
  Clock,
  BookOpen,
  PenTool,
  Bookmark,
  Bug,
  Braces,
  Binary,
  Workflow,
  Radio,
  Wifi,
  Package,
  Boxes,
  Container,
  Flame,
  Settings,
  Sliders,
  Share2,
  Send,
  MessageSquare,
  MessageSquareQuote,
  Quote,
  GraduationCap,
  Images,
  FileText,
  HelpCircle,
};

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
  const IconComponent = ICON_MAP[name] || ICON_MAP.Code2;
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
