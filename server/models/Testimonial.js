import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, trim: true, default: '' },
    avatar: { type: String, default: '' },
    avatarPublicId: { type: String, default: '' },
    feedback: { type: String, required: true, trim: true, maxlength: 1200 },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

testimonialSchema.index({ status: 1, displayOrder: 1 });

export default mongoose.model('Testimonial', testimonialSchema);
