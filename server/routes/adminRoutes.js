import express from 'express';
import { protectAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { uploadAssetMiddleware, uploadImageMiddleware } from '../middleware/upload.js';
import {
  profileSchema,
  projectSchema,
  achievementSchema,
  certificateSchema,
  gallerySchema,
  skillSchema,
  experienceSchema,
  educationSchema,
  serviceSchema,
  testimonialSchema,
  blogSchema,
  reorderSchema,
} from '../validators/schemas.js';
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
import { updateProfile } from '../controllers/profileController.js';
import {
  listAdminMessages,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/contactController.js';
import { updateSettings, exportPortfolioJson } from '../controllers/settingsController.js';
import {
  getUploadStatus,
  uploadSingleFile,
  uploadMultipleImages,
  deleteUploadedFile,
} from '../controllers/uploadController.js';
import { getDashboardStats } from '../controllers/analyticsController.js';

const router = express.Router();

// Every admin route requires a valid HTTP-only JWT cookie
router.use(protectAdmin);

// Dashboard overview & analytics
router.get('/dashboard', getDashboardStats);

// Helper to mount standard CRUD + status + featured + reorder routes cleanly
const mountCrudRoutes = (path, controller, schema) => {
  router.get(`/${path}`, controller.listAdmin);
  router.post(`/${path}`, validateBody(schema), controller.create);
  router.put(`/${path}/reorder`, validateBody(reorderSchema), controller.reorder);
  router.put(`/${path}/:id`, validateBody(schema), controller.update);
  router.patch(`/${path}/:id/status`, controller.toggleStatus);
  router.patch(`/${path}/:id/featured`, controller.toggleFeatured);
  router.delete(`/${path}/:id`, controller.remove);
};

mountCrudRoutes('projects', projectController, projectSchema);
mountCrudRoutes('achievements', achievementController, achievementSchema);
mountCrudRoutes('certificates', certificateController, certificateSchema);
mountCrudRoutes('gallery', galleryController, gallerySchema);
mountCrudRoutes('skills', skillController, skillSchema);
mountCrudRoutes('experience', experienceController, experienceSchema);
mountCrudRoutes('education', educationController, educationSchema);
mountCrudRoutes('services', serviceController, serviceSchema);
mountCrudRoutes('testimonials', testimonialController, testimonialSchema);
mountCrudRoutes('blogs', blogController, blogSchema);

// Profile & Website Settings
router.put('/profile', validateBody(profileSchema), updateProfile);
router.put('/settings', updateSettings);
router.get('/export', exportPortfolioJson);

// Contact messages
router.get('/messages', listAdminMessages);
router.patch('/messages/:id', updateMessageStatus);
router.delete('/messages/:id', deleteMessage);

// Cloudinary upload endpoints
router.get('/upload/status', getUploadStatus);
router.post('/upload/single', uploadAssetMiddleware.single('file'), uploadSingleFile);
router.post('/upload/multiple', uploadImageMiddleware.array('files', 15), uploadMultipleImages);
router.post('/upload/delete', deleteUploadedFile);

export default router;
