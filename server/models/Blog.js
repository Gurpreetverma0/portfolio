import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 400 },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    coverImagePublicId: { type: String, default: '' },
    category: { type: String, trim: true, default: 'Engineering' },
    tags: [{ type: String, trim: true }],
    readTimeMinutes: { type: Number, default: 4 },
    publishedAt: { type: Date },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1, createdAt: -1 });
blogSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });

export default mongoose.model('Blog', blogSchema);
