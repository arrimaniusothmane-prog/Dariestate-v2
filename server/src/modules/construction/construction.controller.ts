import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';
import { ConstructionStatus } from '../../types/enums.js';

const projectCreateSchema = z.object({
  title: z.string().min(3),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(8),
  category: z.string().min(2),
  location: z.string().min(2),
  contractAmount: z.number().positive(),
  startDate: z.string(),
  expectedCompletionDate: z.string(),
  status: z.nativeEnum(ConstructionStatus).default(ConstructionStatus.PLANNING),
  progressPercentage: z.number().min(0).max(100).default(0),
  coverImage: z.string().url(),
  description: z.string().min(10),
  milestones: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    targetDate: z.string(),
    isCompleted: z.boolean().default(false),
    order: z.number().default(0),
  })).optional(),
});

export const getConstructionProjects = async (req: Request, res: Response): Promise<void> => {
  const { status, category } = req.query;

  const where: any = {};
  if (status) where.status = status as ConstructionStatus;
  if (category) where.category = category as string;

  const projects = await prisma.constructionProject.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      projectManager: { select: { id: true, name: true, email: true, avatar: true } },
      milestones: { orderBy: { order: 'asc' } },
    },
  });

  res.json({ success: true, data: projects });
};

export const getConstructionProjectById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const project = await prisma.constructionProject.findUnique({
    where: { id },
    include: {
      projectManager: { select: { id: true, name: true, email: true, avatar: true } },
      milestones: { orderBy: { order: 'asc' } },
    },
  });

  if (!project) {
    res.status(404).json({ success: false, message: 'Projet de construction introuvable.' });
    return;
  }

  res.json({ success: true, data: project });
};

export const createConstructionProject = async (req: AuthRequest, res: Response): Promise<void> => {
  const data = projectCreateSchema.parse(req.body);

  const project = await prisma.constructionProject.create({
    data: {
      title: data.title,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      category: data.category,
      location: data.location,
      contractAmount: data.contractAmount,
      startDate: new Date(data.startDate),
      expectedCompletionDate: new Date(data.expectedCompletionDate),
      status: data.status,
      progressPercentage: data.progressPercentage,
      coverImage: data.coverImage,
      description: data.description,
      projectManagerId: req.user?.id,
      milestones: data.milestones ? {
        create: data.milestones.map((m, i) => ({
          title: m.title,
          description: m.description,
          targetDate: new Date(m.targetDate),
          isCompleted: m.isCompleted,
          order: m.order || i + 1,
        })),
      } : undefined,
    },
    include: { milestones: true },
  });

  res.status(201).json({ success: true, data: project });
};

export const updateConstructionProject = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body;

  const updated = await prisma.constructionProject.update({
    where: { id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      expectedCompletionDate: data.expectedCompletionDate ? new Date(data.expectedCompletionDate) : undefined,
    },
    include: { milestones: true },
  });

  res.json({ success: true, data: updated });
};

export const toggleMilestone = async (req: AuthRequest, res: Response): Promise<void> => {
  const { milestoneId } = req.params;
  const { isCompleted } = req.body;

  const milestone = await prisma.constructionMilestone.update({
    where: { id: milestoneId },
    data: {
      isCompleted,
      completedDate: isCompleted ? new Date() : null,
    },
  });

  res.json({ success: true, data: milestone });
};
