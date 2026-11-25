import multer from 'multer';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_DOC_TYPES = ['application/pdf'];

const storage = multer.memoryStorage();

export const uploadImageMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error('Only JPEG, PNG, WebP, GIF, and SVG images are allowed.');
      err.statusCode = 400;
      cb(err);
    }
  },
});

export const uploadAssetMiddleware = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 }, // 12MB
  fileFilter: (req, file, cb) => {
    if ([...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES].includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error('Only images (JPEG, PNG, WebP, GIF, SVG) or PDF documents are allowed.');
      err.statusCode = 400;
      cb(err);
    }
  },
});
