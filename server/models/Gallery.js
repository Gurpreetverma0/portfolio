import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    caption: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    imageUrl: { type: String, required: true },
    publicId: { type: String, default: '' },
    category: { type: String, trim: true, default: 'Events' },
    altText: { type: String, trim: true, default: '' },
    dateTaken: { type: Date },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'hidden'], default: 'published' },
  },
  { timestamps: true }
);

gallerySchema.index({ status: 1, displayOrder: 1, createdAt: -1 });

export default mongoose.model('Gallery', gallerySchema);
