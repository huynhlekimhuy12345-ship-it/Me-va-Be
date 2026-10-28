import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer memory storage
const storage = multer.memoryStorage();

// File filter: jpg, png, webp only
const fileFilter = (req, file, cb) => {
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ hỗ trợ file ảnh định dạng JPG, PNG hoặc WebP.'));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

/**
 * Process uploaded image buffer with sharp: compress to WebP and create thumbnail
 */
export async function processUploadedImage(buffer) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
  const mainFilename = `prod-${uniqueSuffix}.webp`;
  const thumbFilename = `thumb-${uniqueSuffix}.webp`;

  const mainPath = path.join(uploadDir, mainFilename);
  const thumbPath = path.join(uploadDir, thumbFilename);

  // 1. Main image: resize max 900px, quality 82 webp
  await sharp(buffer)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(mainPath);

  // 2. Thumbnail: 280x280 square cover, quality 80 webp
  await sharp(buffer)
    .resize(280, 280, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(thumbPath);

  return {
    url: `/uploads/${mainFilename}`,
    thumbnailUrl: `/uploads/${thumbFilename}`,
  };
}
