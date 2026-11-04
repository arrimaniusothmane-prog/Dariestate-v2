import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../../middleware/auth.js';
import { config } from '../../config/env.js';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

function serializeFile(file: Express.Multer.File) {
  return {
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    url: `/uploads/${file.filename}`,
  };
}

export const uploadMedia = (req: AuthRequest, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'Aucun fichier transmis.' });
    return;
  }

  if (IMAGE_TYPES.includes(req.file.mimetype) && req.file.size > 10 * 1024 * 1024) {
    fs.unlinkSync(req.file.path);
    res.status(400).json({ success: false, message: 'Chaque image doit peser moins de 10 Mo.' });
    return;
  }

  res.status(201).json({ success: true, file: serializeFile(req.file) });
};

export const uploadMediaMultiple = (req: AuthRequest, res: Response): void => {
  const files = (req.files as Express.Multer.File[] | undefined) || [];
  if (!files.length) {
    res.status(400).json({ success: false, message: 'Aucun fichier transmis.' });
    return;
  }

  const invalid = files.find((file) => IMAGE_TYPES.includes(file.mimetype) && file.size > 10 * 1024 * 1024);
  if (invalid) {
    files.forEach((file) => {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
    res.status(400).json({ success: false, message: 'Chaque image doit peser moins de 10 Mo.' });
    return;
  }

  res.status(201).json({ success: true, files: files.map(serializeFile) });
};

export const getMediaFiles = (req: AuthRequest, res: Response): void => {
  const uploadDir = path.resolve(process.cwd(), config.uploadDir);
  if (!fs.existsSync(uploadDir)) {
    res.json({ success: true, data: [] });
    return;
  }

  const files = fs
    .readdirSync(uploadDir)
    .filter((filename) => !filename.startsWith('.'))
    .map((filename) => {
      const stats = fs.statSync(path.join(uploadDir, filename));
      const ext = path.extname(filename).toLowerCase();
      const isVideo = ['.mp4', '.webm', '.ogg', '.mov'].includes(ext);
      return {
        filename,
        originalName: filename,
        url: `/uploads/${filename}`,
        size: stats.size,
        mimetype: isVideo ? `video/${ext.slice(1)}` : `image/${ext === '.jpg' ? 'jpeg' : ext.slice(1)}`,
        createdAt: stats.birthtime,
      };
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  res.json({ success: true, data: files });
};
