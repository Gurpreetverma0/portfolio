import Profile from '../models/Profile.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logActivity } from '../utils/activity.js';

export const getPublicProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne().lean();
  if (!profile) {
    profile = await Profile.create({
      name: 'Gurpreet Verma',
      headline: 'Full-Stack Developer, UI/UX Designer & Security Engineer',
    });
  }
  res.json({ success: true, data: profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create(req.body);
  } else {
    profile = await Profile.findByIdAndUpdate(profile._id, req.body, {
      new: true,
      runValidators: true,
    });
  }

  await logActivity({
    admin: req.admin,
    action: 'UPDATE',
    resourceType: 'Profile',
    resourceId: profile._id,
    summary: 'Updated public profile and hero information',
  });

  res.json({ success: true, data: profile, message: 'Profile updated successfully' });
});
