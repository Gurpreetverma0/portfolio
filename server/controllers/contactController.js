import crypto from 'crypto';
import ContactMessage from '../models/ContactMessage.js';
import WebsiteSettings from '../models/WebsiteSettings.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendContactNotification } from '../services/emailService.js';
import { logActivity } from '../utils/activity.js';

export const submitContactMessage = asyncHandler(async (req, res) => {
  const ipHash = crypto
    .createHash('sha256')
    .update(req.ip || 'unknown')
    .digest('hex')
    .slice(0, 16);

  const msg = await ContactMessage.create({
    ...req.body,
    ipHash,
  });

  const settings = await WebsiteSettings.findOne().lean();
  let emailSent = false;
  if (settings?.enableContactEmail) {
    try {
      const result = await sendContactNotification(req.body);
      emailSent = result.sent;
    } catch (err) {
      console.warn('Contact email notification failed:', err.message);
    }
  }

  res.status(201).json({
    success: true,
    data: { id: msg._id, emailSent },
    message: 'Thank you! Your message has been received.',
  });
});

export const listAdminMessages = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const filter = {};
  if (status && status !== 'all') filter.status = status;
  if (search && search.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: regex }, { email: regex }, { subject: regex }, { message: regex }];
  }

  const [items, total, unreadCount] = await Promise.all([
    ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ContactMessage.countDocuments(filter),
    ContactMessage.countDocuments({ status: 'unread' }),
  ]);

  res.json({
    success: true,
    data: items,
    unreadCount,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
});

export const updateMessageStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const allowed = ['unread', 'read', 'archived'];
  const update = {};
  if (status && allowed.includes(status)) update.status = status;
  if (typeof adminNotes === 'string') update.adminNotes = adminNotes;

  const updated = await ContactMessage.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  res.json({ success: true, data: updated });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!msg) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  await logActivity({
    admin: req.admin,
    action: 'DELETE',
    resourceType: 'ContactMessage',
    resourceId: msg._id,
    summary: `Deleted contact message from ${msg.name} (${msg.email})`,
  });

  res.json({ success: true, message: 'Message deleted' });
});
