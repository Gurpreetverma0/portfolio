import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async ({ admin, action, resourceType, resourceId = '', summary }) => {
  try {
    await ActivityLog.create({
      adminId: admin?._id,
      adminName: admin?.name || 'Admin',
      action,
      resourceType,
      resourceId: resourceId ? String(resourceId) : '',
      summary,
    });
  } catch (err) {
    console.warn('Activity log error:', err.message);
  }
};
