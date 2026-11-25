import crypto from 'crypto';
import Analytics from '../models/Analytics.js';
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
import ContactMessage from '../models/ContactMessage.js';
import ActivityLog from '../models/ActivityLog.js';
import WebsiteSettings from '../models/WebsiteSettings.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const trackPageView = asyncHandler(async (req, res) => {
  const settings = await WebsiteSettings.findOne().select('enableAnalytics').lean();
  if (settings && settings.enableAnalytics === false) {
    return res.json({ success: true, tracked: false });
  }

  const dateKey = new Date().toISOString().slice(0, 10);
  const path = String(req.body?.path || '/').slice(0, 120);
  const visitorHash = crypto
    .createHash('sha256')
    .update(`${req.ip || 'anon'}:${req.headers['user-agent'] || ''}:${dateKey}`)
    .digest('hex')
    .slice(0, 16);

  let doc = await Analytics.findOne({ dateKey });
  if (!doc) {
    doc = await Analytics.create({
      dateKey,
      pageViews: 1,
      uniqueVisitors: 1,
      visitorHashes: [visitorHash],
      paths: { [path]: 1 },
    });
  } else {
    doc.pageViews += 1;
    if (!doc.visitorHashes.includes(visitorHash)) {
      doc.visitorHashes.push(visitorHash);
      doc.uniqueVisitors += 1;
    }
    const currentPathCount = doc.paths.get(path) || 0;
    doc.paths.set(path, currentPathCount + 1);
    await doc.save();
  }

  res.json({ success: true, tracked: true });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    projectsAll,
    projectsPub,
    achievementsAll,
    achievementsPub,
    certificatesAll,
    certificatesPub,
    galleryAll,
    galleryPub,
    skillsAll,
    skillsPub,
    experienceAll,
    educationAll,
    servicesAll,
    testimonialsAll,
    blogsAll,
    blogsPub,
    messagesAll,
    messagesUnread,
    recentMessages,
    recentActivity,
    analyticsDays,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: 'published' }),
    Achievement.countDocuments(),
    Achievement.countDocuments({ status: 'published' }),
    Certificate.countDocuments(),
    Certificate.countDocuments({ status: 'published' }),
    Gallery.countDocuments(),
    Gallery.countDocuments({ status: 'published' }),
    Skill.countDocuments(),
    Skill.countDocuments({ status: 'published' }),
    Experience.countDocuments(),
    Education.countDocuments(),
    Service.countDocuments(),
    Testimonial.countDocuments(),
    Blog.countDocuments(),
    Blog.countDocuments({ status: 'published' }),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ status: 'unread' }),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
    ActivityLog.find().sort({ createdAt: -1 }).limit(12).lean(),
    Analytics.find().sort({ dateKey: -1 }).limit(14).lean(),
  ]);

  const totalPublished =
    projectsPub + achievementsPub + certificatesPub + galleryPub + skillsPub + blogsPub;
  const totalItems =
    projectsAll + achievementsAll + certificatesAll + galleryAll + skillsAll + blogsAll;
  const totalDrafts = Math.max(0, totalItems - totalPublished);

  const visitorChart = [...analyticsDays]
    .reverse()
    .map((d) => ({
      date: d.dateKey.slice(5),
      views: d.pageViews,
      visitors: d.uniqueVisitors,
    }));

  const totalViews = analyticsDays.reduce((acc, d) => acc + (d.pageViews || 0), 0);
  const totalUniqueVisitors = analyticsDays.reduce((acc, d) => acc + (d.uniqueVisitors || 0), 0);

  const contentBreakdown = [
    { name: 'Projects', published: projectsPub, draft: projectsAll - projectsPub, total: projectsAll },
    { name: 'Skills', published: skillsPub, draft: skillsAll - skillsPub, total: skillsAll },
    { name: 'Certs', published: certificatesPub, draft: certificatesAll - certificatesPub, total: certificatesAll },
    { name: 'Gallery', published: galleryPub, draft: galleryAll - galleryPub, total: galleryAll },
    { name: 'Achieve', published: achievementsPub, draft: achievementsAll - achievementsPub, total: achievementsAll },
    { name: 'Blogs', published: blogsPub, draft: blogsAll - blogsPub, total: blogsAll },
  ];

  res.json({
    success: true,
    data: {
      counts: {
        projects: projectsAll,
        achievements: achievementsAll,
        certificates: certificatesAll,
        gallery: galleryAll,
        skills: skillsAll,
        experience: experienceAll,
        education: educationAll,
        services: servicesAll,
        testimonials: testimonialsAll,
        blogs: blogsAll,
        messages: messagesAll,
        unreadMessages: messagesUnread,
        publishedContent: totalPublished,
        draftContent: totalDrafts,
        totalViews,
        totalUniqueVisitors,
      },
      recentMessages,
      recentActivity,
      visitorChart,
      contentBreakdown,
    },
  });
});
