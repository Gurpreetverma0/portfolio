import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    adminName: { type: String, default: 'Admin' },
    action: {
      type: String,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'UNPUBLISH', 'REORDER', 'LOGIN', 'LOGOUT', 'EXPORT'],
      required: true,
    },
    resourceType: { type: String, required: true },
    resourceId: { type: String, default: '' },
    summary: { type: String, required: true },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });

export default mongoose.model('ActivityLog', activityLogSchema);
