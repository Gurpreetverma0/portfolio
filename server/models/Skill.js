import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    category: {
      type: String,
      required: true,
      trim: true,
      default: 'Frontend',
    },
    level: { type: Number, min: 1, max: 100, default: 85 },
    icon: { type: String, trim: true, default: 'Code2' },
    yearsOfExperience: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

skillSchema.index({ status: 1, category: 1, displayOrder: 1 });

export default mongoose.model('Skill', skillSchema);
