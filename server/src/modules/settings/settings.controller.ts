import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  let settings = await prisma.companySettings.findUnique({
    where: { id: 'default' },
  });

  if (!settings) {
    settings = await prisma.companySettings.create({
      data: { id: 'default' },
    });
  }

  res.json({ success: true, data: settings });
};

export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  const data = req.body;

  const settings = await prisma.companySettings.upsert({
    where: { id: 'default' },
    update: data,
    create: { id: 'default', ...data },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user?.id,
      action: 'SETTINGS_UPDATED',
      entityType: 'CompanySettings',
      entityId: 'default',
      details: 'Mise à jour des paramètres généraux de l’entreprise',
    },
  });

  res.json({ success: true, data: settings });
};
