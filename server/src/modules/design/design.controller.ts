import { Request, Response } from 'express';
import { Prisma, DesignProject } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';
import { DesignCategory } from '../../types/enums.js';

const mediaUrl = z
  .string()
  .trim()
  .min(1)
  .refine((value) => /^(\/uploads\/|https?:\/\/)/i.test(value), 'URL de média invalide');

const designCreateSchema = z.object({
  title: z.string().min(3),
  category: z.nativeEnum(DesignCategory),
  location: z.string().optional().nullable(),
  surfaceArea: z.coerce.number().optional().nullable(),
  year: z.coerce.number().int().default(2025),
  description: z.string().min(10),
  designApproach: z.string().min(10),
  materials: z.array(z.string()).default([]),
  coverImage: mediaUrl,
  galleryImages: z.array(mediaUrl).default([]),
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
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || 'projet-design';
  let slug = base;
  let counter = 2;
  while (await prisma.designProject.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

function parseJsonArray(value: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function serializeProject(project: DesignProject) {
  return {
    ...project,
    materials: parseJsonArray(project.materials),
    galleryImages: parseJsonArray(project.galleryImages),
  };
}

export const getDesignProjects = async (req: Request, res: Response): Promise<void> => {
  const { category, isFeatured } = req.query;

  const where: Prisma.DesignProjectWhereInput = { isPublished: true };
  if (category && category !== 'ALL') where.category = String(category);
  if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

  const projects = await prisma.designProject.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: projects.map(serializeProject) });
};

export const getDesignProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  const project = await prisma.designProject.findUnique({
    where: { slug: req.params.slug },
  });

  if (!project) {
    res.status(404).json({ success: false, message: 'Projet de design introuvable.' });
    return;
  }

  res.json({ success: true, data: serializeProject(project) });
};

export const createDesignProject = async (req: AuthRequest, res: Response): Promise<void> => {
  const data = designCreateSchema.parse(req.body);
  const slug = await uniqueSlug(data.title);

  const project = await prisma.designProject.create({
    data: {
      ...data,
      slug,
      materials: JSON.stringify(data.materials),
      galleryImages: JSON.stringify(data.galleryImages),
    },
  });

  res.status(201).json({ success: true, data: serializeProject(project) });
};

export const updateDesignProject = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const parsed = designCreateSchema.partial().parse(req.body);
  const { materials, galleryImages, ...rest } = parsed;
  const data: Prisma.DesignProjectUpdateInput = { ...rest };

  if (materials !== undefined) data.materials = JSON.stringify(materials);
  if (galleryImages !== undefined) data.galleryImages = JSON.stringify(galleryImages);

  const updated = await prisma.designProject.update({
    where: { id },
    data,
  });

  res.json({ success: true, data: serializeProject(updated) });
};

export const deleteDesignProject = async (req: AuthRequest, res: Response): Promise<void> => {
  await prisma.designProject.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Projet de design supprimé.' });
};
