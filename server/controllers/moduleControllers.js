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
import { createCrudController } from './crudFactory.js';
import { generateUniqueSlug } from '../utils/slugify.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

export const projectController = createCrudController({
  Model: Project,
  resourceName: 'Project',
  searchFields: ['title', 'shortDescription', 'category', 'techStack'],
  defaultSort: { isFeatured: -1, displayOrder: 1, createdAt: -1 },
  beforeCreate: async (payload) => {
    payload.slug = await generateUniqueSlug(Project, payload.slug || payload.title);
    return payload;
  },
  beforeUpdate: async (payload, existing) => {
    if (payload.title && payload.title !== existing.title && !payload.slug) {
      payload.slug = await generateUniqueSlug(Project, payload.title, existing._id);
    } else if (payload.slug && payload.slug !== existing.slug) {
      payload.slug = await generateUniqueSlug(Project, payload.slug, existing._id);
    }
    return payload;
  },
  afterDelete: async (item) => {
    if (item.thumbnailPublicId) await deleteFromCloudinary(item.thumbnailPublicId);
    if (Array.isArray(item.screenshots)) {
      await Promise.all(
        item.screenshots
          .filter((s) => s.publicId)
          .map((s) => deleteFromCloudinary(s.publicId))
      );
    }
  },
});

export const achievementController = createCrudController({
  Model: Achievement,
  resourceName: 'Achievement',
  searchFields: ['title', 'description', 'organization', 'category'],
  defaultSort: { displayOrder: 1, date: -1 },
  afterDelete: async (item) => {
    if (item.imagePublicId) await deleteFromCloudinary(item.imagePublicId);
  },
});

export const certificateController = createCrudController({
  Model: Certificate,
  resourceName: 'Certificate',
  searchFields: ['title', 'issuingOrganization', 'credentialId', 'category'],
  defaultSort: { displayOrder: 1, issueDate: -1 },
  afterDelete: async (item) => {
    if (item.filePublicId) {
      await deleteFromCloudinary(
        item.filePublicId,
        item.fileType === 'pdf' ? 'raw' : 'image'
      );
    }
  },
});

export const galleryController = createCrudController({
  Model: Gallery,
  resourceName: 'Gallery',
  searchFields: ['title', 'caption', 'description', 'category'],
  defaultSort: { displayOrder: 1, createdAt: -1 },
  publishedStatus: 'published',
  afterDelete: async (item) => {
    if (item.publicId) await deleteFromCloudinary(item.publicId);
  },
});

export const skillController = createCrudController({
  Model: Skill,
  resourceName: 'Skill',
  searchFields: ['name', 'category', 'description'],
  defaultSort: { category: 1, displayOrder: 1, level: -1 },
});

export const experienceController = createCrudController({
  Model: Experience,
  resourceName: 'Experience',
  searchFields: ['company', 'position', 'location', 'description'],
  defaultSort: { displayOrder: 1, startDate: -1 },
  afterDelete: async (item) => {
    if (item.companyLogoPublicId) await deleteFromCloudinary(item.companyLogoPublicId);
  },
});

export const educationController = createCrudController({
  Model: Education,
  resourceName: 'Education',
  searchFields: ['institution', 'degree', 'fieldOfStudy', 'description'],
  defaultSort: { displayOrder: 1, startYear: -1 },
});

export const serviceController = createCrudController({
  Model: Service,
  resourceName: 'Service',
  searchFields: ['title', 'shortDescription', 'fullDescription'],
  defaultSort: { displayOrder: 1, createdAt: -1 },
});

export const testimonialController = createCrudController({
  Model: Testimonial,
  resourceName: 'Testimonial',
  searchFields: ['name', 'role', 'company', 'feedback'],
  defaultSort: { displayOrder: 1, createdAt: -1 },
  afterDelete: async (item) => {
    if (item.avatarPublicId) await deleteFromCloudinary(item.avatarPublicId);
  },
});

export const blogController = createCrudController({
  Model: Blog,
  resourceName: 'Blog',
  searchFields: ['title', 'excerpt', 'category', 'tags'],
  defaultSort: { publishedAt: -1, createdAt: -1 },
  beforeCreate: async (payload) => {
    payload.slug = await generateUniqueSlug(Blog, payload.slug || payload.title);
    if (payload.status === 'published' && !payload.publishedAt) {
      payload.publishedAt = new Date();
    }
    return payload;
  },
  beforeUpdate: async (payload, existing) => {
    if (payload.title && payload.title !== existing.title && !payload.slug) {
      payload.slug = await generateUniqueSlug(Blog, payload.title, existing._id);
    } else if (payload.slug && payload.slug !== existing.slug) {
      payload.slug = await generateUniqueSlug(Blog, payload.slug, existing._id);
    }
    if (payload.status === 'published' && !existing.publishedAt && !payload.publishedAt) {
      payload.publishedAt = new Date();
    }
    return payload;
  },
  afterDelete: async (item) => {
    if (item.coverImagePublicId) await deleteFromCloudinary(item.coverImagePublicId);
  },
});
