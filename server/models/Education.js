import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true, maxlength: 160 },
    degree: { type: String, required: true, trim: true, maxlength: 140 },
    fieldOfStudy: { type: String, trim: true, default: '' },
    startYear: { type: Number, required: true },
    endYear: { type: Number },
    isCurrent: { type: Boolean, default: false },
    grade: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    achievements: [{ type: String, trim: true }],
    institutionLogo: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

educationSchema.index({ status: 1, displayOrder: 1, startYear: -1 });

export default mongoose.model('Education', educationSchema);
