import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';
import { InquiryStatus, Priority } from '@prisma/client';

const inquiryCreateSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Numéro de téléphone requis'),
  propertyId: z.string().optional(),
  subject: z.string().min(3, 'Objet requis'),
  message: z.string().min(10, 'Message trop court'),
  preferredContactMethod: z.enum(['PHONE', 'EMAIL', 'WHATSAPP']).default('PHONE'),
});

export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  const data = inquiryCreateSchema.parse(req.body);

  const inquiry = await prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      propertyId: data.propertyId,
      subject: data.subject,
      message: data.message,
      preferredContactMethod: data.preferredContactMethod,
      source: data.propertyId ? 'PROPERTY_PAGE' : 'CONTACT_FORM',
      priority: Priority.MEDIUM,
      status: InquiryStatus.NEW,
    },
    include: { property: { select: { title: true, slug: true } } },
  });

  res.status(201).json({
    success: true,
    message: 'Votre message a été transmis avec succès à nos équipes. Nous vous recontacterons dans les plus brefs délais.',
    data: inquiry,
  });
};

export const getInquiries = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, priority, search, assignedToId } = req.query;

  const where: any = {};
  if (status) where.status = status as InquiryStatus;
  if (priority) where.priority = priority as Priority;
  if (assignedToId) where.assignedToId = assignedToId as string;

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } },
      { phone: { contains: search as string } },
      { subject: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      property: { select: { id: true, title: true, slug: true, coverImage: true, price: true } },
      assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
      notes: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  res.json({ success: true, data: inquiries });
};

export const updateInquiry = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, priority, assignedToId, followUpDate, newNote } = req.body;

  const updateData: any = {};
  if (status) updateData.status = status;
  if (priority) updateData.priority = priority;
  if (assignedToId !== undefined) updateData.assignedToId = assignedToId;
  if (followUpDate) updateData.followUpDate = new Date(followUpDate);

  if (newNote && req.user) {
    await prisma.inquiryNote.create({
      data: {
        inquiryId: id,
        authorId: req.user.id,
        content: newNote,
      },
    });
  }

  const updated = await prisma.inquiry.update({
    where: { id },
    data: updateData,
    include: {
      property: true,
      assignedTo: true,
      notes: { include: { author: true } },
    },
  });

  res.json({ success: true, data: updated });
};
