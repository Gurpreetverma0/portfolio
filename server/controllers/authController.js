import Admin from '../models/Admin.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { COOKIE_NAME, getCookieOptions, signAdminToken } from '../middleware/auth.js';
import { logActivity } from '../utils/activity.js';

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+passwordHash');

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = signAdminToken(admin);
  res.cookie(COOKIE_NAME, token, getCookieOptions());

  await logActivity({
    admin,
    action: 'LOGIN',
    resourceType: 'Auth',
    summary: `Admin signed in (${admin.email})`,
  });

  res.json({
    success: true,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
      lastLogin: admin.lastLogin,
    },
  });
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  if (req.admin) {
    await logActivity({
      admin: req.admin,
      action: 'LOGOUT',
      resourceType: 'Auth',
      summary: `Admin signed out (${req.admin.email})`,
    });
  }
  const cookieOpts = getCookieOptions();
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: cookieOpts.secure,
    sameSite: cookieOpts.sameSite,
    path: '/',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      avatar: req.admin.avatar,
      lastLogin: req.admin.lastLogin,
    },
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id).select('+passwordHash');
  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin not found' });
  }

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  admin.passwordHash = await Admin.hashPassword(newPassword);
  await admin.save();

  res.json({ success: true, message: 'Password updated successfully' });
});
