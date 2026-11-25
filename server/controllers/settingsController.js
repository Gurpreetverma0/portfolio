import WebsiteSettings, { DEFAULT_SECTION_ORDER } from '../models/WebsiteSettings.js';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import Certificate from '../models/Certificate.js';
import Gallery from '../models/Gallery.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Blog from '../models/Blog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logActivity } from '../utils/activity.js';

export const getPublicSettings = asyncHandler(async (req, res) => {
  let settings = await WebsiteSettings.findOne().lean();
  if (!settings) {
    settings = await WebsiteSettings.create({ sectionOrder: DEFAULT_SECTION_ORDER });
  }
  res.json({ success: true, data: settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await WebsiteSettings.findOne();
  if (!settings) {
    settings = await WebsiteSettings.create(req.body);
  } else {
    settings = await WebsiteSettings.findByIdAndUpdate(settings._id, req.body, {
      new: true,
      runValidators: true,
    });
  }

  await logActivity({
    admin: req.admin,
    action: 'UPDATE',
    resourceType: 'WebsiteSettings',
    resourceId: settings._id,
    summary: 'Updated website SEO, theme, visibility, and section settings',
  });

  res.json({ success: true, data: settings, message: 'Settings saved successfully' });
});

export const exportPortfolioJson = asyncHandler(async (req, res) => {
  const [
    profile,
    settings,
    projects,
    achievements,
    certificates,
    gallery,
    skills,
    experience,
    education,
    services,
    testimonials,
    blogs,
  ] = await Promise.all([
    Profile.findOne().lean(),
    WebsiteSettings.findOne().lean(),
    Project.find().sort({ displayOrder: 1 }).lean(),
    Achievement.find().sort({ displayOrder: 1 }).lean(),
    Certificate.find().sort({ displayOrder: 1 }).lean(),
    Gallery.find().sort({ displayOrder: 1 }).lean(),
    Skill.find().sort({ displayOrder: 1 }).lean(),
    Experience.find().sort({ displayOrder: 1 }).lean(),
    Education.find().sort({ displayOrder: 1 }).lean(),
    Service.find().sort({ displayOrder: 1 }).lean(),
    Testimonial.find().sort({ displayOrder: 1 }).lean(),
    Blog.find().sort({ createdAt: -1 }).lean(),
  ]);

  await logActivity({
    admin: req.admin,
    action: 'EXPORT',
    resourceType: 'Backup',
    summary: 'Exported full portfolio JSON backup',
  });

  res.setHeader('Content-Disposition', `attachment; filename="portfolio-backup-${Date.now()}.json"`);
  res.json({
    exportedAt: new Date().toISOString(),
    profile,
    settings,
    projects,
    achievements,
    certificates,
    gallery,
    skills,
    experience,
    education,
    services,
    testimonials,
    blogs,
  });
});

/**
 * Aggregated single endpoint for the public portfolio landing page
 * so all sections load swiftly and stay synced with DB changes.
 */
export const getFullPortfolioBootstrap = asyncHandler(async (req, res) => {
  const [
    profile,
    settings,
    skills,
    projects,
    achievements,
    certificates,
    gallery,
    experience,
    education,
    services,
    testimonials,
    blogs,
  ] = await Promise.all([
    Profile.findOne().lean(),
    WebsiteSettings.findOne().lean(),
    Skill.find({ status: 'published' }).sort({ category: 1, displayOrder: 1, level: -1 }).lean(),
    Project.find({ status: 'published' }).sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 }).lean(),
    Achievement.find({ status: 'published' }).sort({ displayOrder: 1, date: -1 }).lean(),
    Certificate.find({ status: 'published' }).sort({ displayOrder: 1, issueDate: -1 }).lean(),
    Gallery.find({ status: 'published' }).sort({ displayOrder: 1, createdAt: -1 }).lean(),
    Experience.find({ status: 'published' }).sort({ displayOrder: 1, startDate: -1 }).lean(),
    Education.find({ status: 'published' }).sort({ displayOrder: 1, startYear: -1 }).lean(),
    Service.find({ status: 'published' }).sort({ displayOrder: 1, createdAt: -1 }).lean(),
    Testimonial.find({ status: 'published' }).sort({ displayOrder: 1, createdAt: -1 }).lean(),
    Blog.find({ status: 'published' }).sort({ publishedAt: -1, createdAt: -1 }).lean(),
  ]);

  res.json({
    success: true,
    data: {
      profile,
      settings,
      skills,
      projects,
      achievements,
      certificates,
      gallery,
      experience,
      education,
      services,
      testimonials,
      blogs,
    },
  });
});
