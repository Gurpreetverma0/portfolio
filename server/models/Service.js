import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    shortDescription: { type: String, required: true, trim: true, maxlength: 260 },
    fullDescription: { type: String, trim: true, default: '' },
    icon: { type: String, trim: true, default: 'Code2' },
    features: [{ type: String, trim: true }],
    startingPrice: { type: String, trim: true, default: '' },
    deliveryTime: { type: String, trim: true, default: '' },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

serviceSchema.index({ status: 1, displayOrder: 1 });

export default mongoose.model('Service', serviceSchema);
