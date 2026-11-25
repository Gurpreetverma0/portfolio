import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 320 },
    fullDescription: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: '' },
    thumbnailPublicId: { type: String, default: '' },
    screenshots: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
        caption: { type: String, default: '' },
      },
    ],
    techStack: [{ type: String, trim: true }],
    category: { type: String, required: true, trim: true, default: 'Full-Stack' },
    githubUrl: { type: String, trim: true, default: '' },
    liveDemoUrl: { type: String, trim: true, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ status: 1, displayOrder: 1, createdAt: -1 });
projectSchema.index({ title: 'text', shortDescription: 'text', techStack: 'text' });

export default mongoose.model('Project', projectSchema);
