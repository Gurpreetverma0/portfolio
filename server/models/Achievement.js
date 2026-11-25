import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    date: { type: Date, required: true },
    organization: { type: String, trim: true, default: '' },
    category: {
      type: String,
      trim: true,
      default: 'Award',
    },
    credentialUrl: { type: String, trim: true, default: '' },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

achievementSchema.index({ status: 1, displayOrder: 1, date: -1 });

export default mongoose.model('Achievement', achievementSchema);
