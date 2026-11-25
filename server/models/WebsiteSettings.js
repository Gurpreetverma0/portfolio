import mongoose from 'mongoose';

const DEFAULT_SECTION_ORDER = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'achievements',
  'certificates',
  'gallery',
  'services',
  'testimonials',
  'blog',
  'resume',
  'contact',
];

const websiteSettingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, trim: true, default: 'Gurpreet Verma — Portfolio' },
    siteTagline: {
      type: String,
      trim: true,
      default: 'Full-Stack Developer, UI/UX Designer & Security Engineer',
    },
    metaDescription: {
      type: String,
      trim: true,
      default:
        'Dynamic portfolio showcasing full-stack web engineering, cybersecurity, achievements, certifications, and technical writing.',
    },
    ogImage: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    logoText: { type: String, trim: true, default: 'GV.' },
    accentColor: { type: String, trim: true, default: '#6366f1' },
    defaultTheme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: {
      type: String,
      trim: true,
      default: 'Portfolio is currently undergoing scheduled updates. Please check back shortly.',
    },
    enableAnalytics: { type: Boolean, default: true },
    enableContactEmail: { type: Boolean, default: false },
    footerText: {
      type: String,
      trim: true,
      default: 'Engineered with security, performance, and craft.',
    },
    copyrightText: {
      type: String,
      trim: true,
      default: `© ${new Date().getFullYear()} Gurpreet Verma. All rights reserved.`,
    },
    navbarLinks: {
      type: [
        {
          label: { type: String, trim: true },
          href: { type: String, trim: true },
          visible: { type: Boolean, default: true },
        },
      ],
      default: [
        { label: 'About', href: '#about', visible: true },
        { label: 'Skills', href: '#skills', visible: true },
        { label: 'Projects', href: '#projects', visible: true },
        { label: 'Experience', href: '#experience', visible: true },
        { label: 'Certificates', href: '#certificates', visible: true },
        { label: 'Gallery', href: '#gallery', visible: true },
        { label: 'Blog', href: '#blog', visible: true },
        { label: 'Contact', href: '#contact', visible: true },
      ],
    },
    visibleSections: {
      hero: { type: Boolean, default: true },
      about: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      certificates: { type: Boolean, default: true },
      gallery: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      education: { type: Boolean, default: true },
      services: { type: Boolean, default: true },
      testimonials: { type: Boolean, default: true },
      blog: { type: Boolean, default: true },
      resume: { type: Boolean, default: true },
      contact: { type: Boolean, default: true },
    },
    sectionOrder: {
      type: [String],
      default: DEFAULT_SECTION_ORDER,
    },
  },
  { timestamps: true }
);

export { DEFAULT_SECTION_ORDER };
export default mongoose.model('WebsiteSettings', websiteSettingsSchema);
