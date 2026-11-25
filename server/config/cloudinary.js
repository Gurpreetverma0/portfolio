import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

export const isCloudinaryConfigured = () => {
  return Boolean(
    env.cloudinary.cloudName &&
      env.cloudinary.apiKey &&
      env.cloudinary.apiSecret &&
      !env.cloudinary.cloudName.includes('your_')
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

/**
 * Upload a file buffer to Cloudinary with automatic optimization.
 * Supports images and raw/pdf files (used for certificates & resumes).
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  if (!isCloudinaryConfigured()) {
    const err = new Error(
      'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your server environment.'
    );
    err.statusCode = 503;
    throw err;
  }

  const {
    folder = 'portfolio',
    resourceType = 'auto',
    publicId,
  } = options;

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: resourceType,
      ...(publicId ? { public_id: publicId } : {}),
      ...(resourceType === 'image'
        ? {
            transformation: [
              { quality: 'auto:good', fetch_format: 'auto' },
            ],
          }
        : {}),
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!isCloudinaryConfigured() || !publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.warn('Cloudinary delete warning:', err.message);
    return null;
  }
};

export default cloudinary;
