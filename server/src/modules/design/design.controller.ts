import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';
import { DesignCategory } from '@prisma/client';

const designCreateSchema = z.object({
  title: z.string().min(3),
  category: z.nativeEnum(DesignCategory),
  location: z.string().optional(),
  surfaceArea: z.number().optional().nullable(),
  year: z.number().int().default(2025),
  description: z.string().min(10),
  designApproach: z.string().min(10),
  materials: z.array(z.string()).default([]),
  coverImage: z.string().url(),
  galleryImages: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export const getDesignProjects = async (req: Request, res: Response): Promise<void> => {
  const { category, isFeatured } = req.query;

  const where: any = { isPublished: true };
  if (category && category !== 'ALL') where.category = category as DesignCategory;
  if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

  const projects = await prisma.designProject.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: projects });
};

export const getDesignProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  const project = await prisma.designProject.findUnique({
    where: { slug },
  });

  if (!project) {
    res.status(404).json({ success: false, message: 'Projet de design introuvable.' });
    return;
  }

  res.json({ success: true, data: project });
};

export const createDesignProject = async (req: AuthRequest, res: Response): Promise<void> => {
  const data = designCreateSchema.parse(req.body);
  const baseSlug = slugify(data.title);
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const project = await prisma.designProject.create({
    data: {
      ...data,
      slug,
    },
  });

  res.status(201).json({ success: true, data: project });
};

export const updateDesignProject = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body;

  const updated = await prisma.designProject.update({
    where: { id },
    data,
  });

  res.json({ success: true, data: updated });
};

export const deleteDesignProject = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  await prisma.designProject.delete({ where: { id } });
  res.json({ success: true, message: 'Projet de design supprimé.' });
};
