import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, '../../uploads');

function ensureDirectoryExists(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function createStorage(folderName) {
  return multer.diskStorage({
    destination(req, file, callback) {
      const targetDirectory = path.join(uploadsRoot, folderName);
      ensureDirectoryExists(targetDirectory);
      callback(null, targetDirectory);
    },
    filename(req, file, callback) {
      const extension = path.extname(file.originalname || '');
      const baseName = path
        .basename(file.originalname || 'upload', extension)
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();

      callback(null, `${Date.now()}-${baseName || 'file'}${extension.toLowerCase()}`);
    },
  });
}

function createFileFilter(allowedExtensions) {
  return (req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();

    if (allowedExtensions.includes(extension)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Unsupported file type: ${extension || 'unknown'}`));
  };
}

export function createSingleFileUpload({ folderName, allowedExtensions, fieldName }) {
  return multer({
    storage: createStorage(folderName),
    fileFilter: createFileFilter(allowedExtensions),
    limits: { fileSize: 10 * 1024 * 1024 },
  }).single(fieldName);
}

export function buildUploadedFileUrl(req, file) {
  if (!file) {
    return '';
  }

  const relativePath = path
    .join('uploads', path.basename(path.dirname(file.path)), file.filename)
    .replace(/\\/g, '/');

  return `${req.protocol}://${req.get('host')}/${relativePath}`;
}

export function getUploadsRoot() {
  ensureDirectoryExists(uploadsRoot);
  return uploadsRoot;
}
