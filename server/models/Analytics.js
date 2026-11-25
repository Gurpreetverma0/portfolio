import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    dateKey: { type: String, required: true, unique: true }, // YYYY-MM-DD
    pageViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    visitorHashes: [{ type: String }],
    paths: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

analyticsSchema.index({ dateKey: -1 });

export default mongoose.model('Analytics', analyticsSchema);
