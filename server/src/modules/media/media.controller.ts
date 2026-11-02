import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../../middleware/auth.js';
import { config } from '../../config/env.js';

export const uploadMedia = (req: AuthRequest, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'Aucun fichier transmis.' });
    return;
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({
    success: true,
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: fileUrl,
    },
  });
};

export const getMediaFiles = (req: AuthRequest, res: Response): void => {
  const uploadDir = path.resolve(process.cwd(), config.uploadDir);
  if (!fs.existsSync(uploadDir)) {
    res.json({ success: true, data: [] });
    return;
  }

  const files = fs.readdirSync(uploadDir).map((filename) => {
    const stats = fs.statSync(path.join(uploadDir, filename));
    return {
      filename,
      url: `/uploads/${filename}`,
      size: stats.size,
      createdAt: stats.birthtime,
    };
  });

  res.json({ success: true, data: files });
};
