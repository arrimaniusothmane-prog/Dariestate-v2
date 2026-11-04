import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';

export const getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Non authentifié.' });
    return;
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: req.user.id },
    include: {
      property: {
        include: {
          images: { orderBy: { order: 'asc' } },
          features: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: favorites.map(f => f.property),
  });
};

export const addFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Non authentifié.' });
    return;
  }

  const { propertyId } = req.body;

  if (!propertyId) {
    res.status(400).json({ success: false, message: 'ID de propriété requis.' });
    return;
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    res.status(404).json({ success: false, message: 'Propriété introuvable.' });
    return;
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId: req.user.id,
        propertyId,
      },
    },
  });

  if (existing) {
    res.json({ success: true, message: 'Déjà dans les favoris.', isFavorite: true });
    return;
  }

  await prisma.favorite.create({
    data: {
      userId: req.user.id,
      propertyId,
    },
  });

  res.json({ success: true, message: 'Ajouté aux favoris.', isFavorite: true });
};

export const removeFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Non authentifié.' });
    return;
  }

  const { propertyId } = req.params;

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId: req.user.id,
        propertyId,
      },
    },
  });

  if (!existing) {
    res.status(404).json({ success: false, message: 'Favori introuvable.' });
    return;
  }

  await prisma.favorite.delete({
    where: { id: existing.id },
  });

  res.json({ success: true, message: 'Retiré des favoris.', isFavorite: false });
};

export const checkFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Non authentifié.' });
    return;
  }

  const { propertyId } = req.params;

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId: req.user.id,
        propertyId,
      },
    },
  });

  res.json({ success: true, isFavorite: !!favorite });
};
