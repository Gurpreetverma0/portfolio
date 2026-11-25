import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    issuingOrganization: { type: String, required: true, trim: true, maxlength: 140 },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date },
    credentialId: { type: String, trim: true, default: '' },
    verificationUrl: { type: String, trim: true, default: '' },
    fileUrl: { type: String, default: '' },
    filePublicId: { type: String, default: '' },
    fileType: { type: String, enum: ['image', 'pdf'], default: 'image' },
    category: { type: String, trim: true, default: 'Technical' },
    description: { type: String, trim: true, default: '' },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

certificateSchema.index({ status: 1, displayOrder: 1, issueDate: -1 });

export default mongoose.model('Certificate', certificateSchema);
