import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true, maxlength: 140 },
    position: { type: String, required: true, trim: true, maxlength: 140 },
    employmentType: { type: String, trim: true, default: 'Full-time' },
    location: { type: String, trim: true, default: 'Remote' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, trim: true, default: '' },
    responsibilities: [{ type: String, trim: true }],
    achievements: [{ type: String, trim: true }],
    techUsed: [{ type: String, trim: true }],
    companyLogo: { type: String, default: '' },
    companyLogoPublicId: { type: String, default: '' },
    companyUrl: { type: String, trim: true, default: '' },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

experienceSchema.index({ status: 1, displayOrder: 1, startDate: -1 });

export default mongoose.model('Experience', experienceSchema);
