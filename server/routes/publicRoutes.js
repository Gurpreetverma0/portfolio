import express from 'express';
import {
  projectController,
  achievementController,
  certificateController,
  galleryController,
  skillController,
  experienceController,
  educationController,
  serviceController,
  testimonialController,
  blogController,
} from '../controllers/moduleControllers.js';
import { getPublicProfile } from '../controllers/profileController.js';
import { submitContactMessage } from '../controllers/contactController.js';
import { getPublicSettings, getFullPortfolioBootstrap } from '../controllers/settingsController.js';
import { trackPageView } from '../controllers/analyticsController.js';
import { validateBody } from '../middleware/validate.js';
import { contactSchema } from '../validators/schemas.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Aggregated bootstrap for fast initial load
router.get('/portfolio/bootstrap', getFullPortfolioBootstrap);

// Profile & settings
router.get('/profile', getPublicProfile);
router.get('/settings', getPublicSettings);

// Dynamic content modules
router.get('/projects', projectController.listPublic);
router.get('/projects/:idOrSlug', projectController.getOnePublic);

router.get('/achievements', achievementController.listPublic);
router.get('/certificates', certificateController.listPublic);
router.get('/gallery', galleryController.listPublic);
router.get('/skills', skillController.listPublic);
router.get('/experience', experienceController.listPublic);
router.get('/education', educationController.listPublic);
router.get('/services', serviceController.listPublic);
router.get('/testimonials', testimonialController.listPublic);

router.get('/blogs', blogController.listPublic);
router.get('/blogs/:idOrSlug', blogController.getOnePublic);

// Contact & analytics
router.post('/contact', contactRateLimiter, validateBody(contactSchema), submitContactMessage);
router.post('/analytics/track', trackPageView);

export default router;
