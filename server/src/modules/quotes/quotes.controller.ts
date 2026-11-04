import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';
import { QuoteStatus } from '../../types/enums.js';

const quoteCreateSchema = z.object({
  fullName: z.string().min(2, 'Nom complet requis'),
  email: z.string().email('Email valide requis'),
  phone: z.string().min(8, 'Numéro de téléphone requis'),
  city: z.string().min(2, 'Ville requise'),
  projectType: z.string().min(2, 'Type de projet requis'),
  plotSize: z.number().optional().nullable(),
  estimatedArea: z.number().optional().nullable(),
  numberOfFloors: z.number().optional().nullable(),
  budgetRange: z.string().optional().nullable(),
  expectedStartDate: z.string().optional().nullable(),
  description: z.string().min(15, 'Veuillez décrire brièvement votre projet'),
  attachments: z.array(z.string()).optional(),
});

export const createQuoteRequest = async (req: Request, res: Response): Promise<void> => {
  const data = quoteCreateSchema.parse(req.body);

  const quote = await prisma.quoteRequest.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      projectType: data.projectType,
      plotSize: data.plotSize,
      estimatedArea: data.estimatedArea,
      numberOfFloors: data.numberOfFloors,
      budgetRange: data.budgetRange,
      expectedStartDate: data.expectedStartDate,
      description: data.description,
      attachments: JSON.stringify(data.attachments || []),
      status: QuoteStatus.PENDING,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Votre demande de devis a été enregistrée avec succès. Notre direction des projets vous contactera sous 24 à 48 heures.',
    data: { ...quote, attachments: data.attachments || [] },
  });
};

export const getQuoteRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, projectType, search } = req.query;

  const where: any = {};
  if (status) where.status = status as QuoteStatus;
  if (projectType) where.projectType = projectType as string;
  if (search) {
    where.OR = [
      { fullName: { contains: search as string } },
      { email: { contains: search as string } },
      { city: { contains: search as string } },
    ];
  }

  const quotes = await prisma.quoteRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
    },
  });

  res.json({
    success: true,
    data: quotes.map((quote) => ({
      ...quote,
      attachments: (() => {
        try {
          return JSON.parse(quote.attachments || '[]');
        } catch {
          return [];
        }
      })(),
    })),
  });
};

export const updateQuoteRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, proposedPrice, assignedToId, internalNotes } = req.body;

  const updateData: any = {};
  if (status) updateData.status = status;
  if (proposedPrice !== undefined) updateData.proposedPrice = parseFloat(proposedPrice);
  if (assignedToId !== undefined) updateData.assignedToId = assignedToId;
  if (internalNotes !== undefined) updateData.internalNotes = internalNotes;

  const updated = await prisma.quoteRequest.update({
    where: { id },
    data: updateData,
    include: { assignedTo: true },
  });

  res.json({ success: true, data: updated });
};
