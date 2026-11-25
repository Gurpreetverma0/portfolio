import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from '../config/cloudinary.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getUploadStatus = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      configured: isCloudinaryConfigured(),
      message: isCloudinaryConfigured()
        ? 'Cloudinary is configured and ready.'
        : 'Cloudinary credentials are missing. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your server .env file.',
    },
  });
});

export const uploadSingleFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }

  const folder = req.body.folder ? `portfolio/${req.body.folder}` : 'portfolio/uploads';
  const isPdf = req.file.mimetype === 'application/pdf';
  const resourceType = isPdf ? 'raw' : 'image';

  const result = await uploadBufferToCloudinary(req.file.buffer, {
    folder,
    resourceType,
  });

  res.status(201).json({
    success: true,
    data: {
      url: result.secure_url,
      publicId: result.public_id,
      fileType: isPdf ? 'pdf' : 'image',
      originalName: req.file.originalname,
      bytes: result.bytes,
    },
  });
});

export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files provided' });
  }

  const folder = req.body.folder ? `portfolio/${req.body.folder}` : 'portfolio/gallery';

  const uploaded = await Promise.all(
    req.files.map((file) =>
      uploadBufferToCloudinary(file.buffer, {
        folder,
        resourceType: 'image',
      }).then((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
        originalName: file.originalname,
        bytes: result.bytes,
      }))
    )
  );

  res.status(201).json({
    success: true,
    data: uploaded,
  });
});

export const deleteUploadedFile = asyncHandler(async (req, res) => {
  const { publicId, resourceType = 'image' } = req.body;
  if (!publicId) {
    return res.status(400).json({ success: false, message: 'publicId is required' });
  }
  await deleteFromCloudinary(publicId, resourceType);
  res.json({ success: true, message: 'File removed from Cloudinary' });
});
