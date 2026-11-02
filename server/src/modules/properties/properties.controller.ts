import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';
import { PropertyType, TransactionType, PropertyStatus } from '@prisma/client';

const propertyCreateSchema = z.object({
  title: z.string().min(5, 'Le titre doit comporter au moins 5 caractères'),
  description: z.string().min(20, 'La description doit comporter au moins 20 caractères'),
  type: z.nativeEnum(PropertyType),
  transactionType: z.nativeEnum(TransactionType),
  price: z.number().positive('Le prix doit être positif'),
  currency: z.string().default('MAD'),
  city: z.string().min(2),
  neighborhood: z.string().min(2),
  address: z.string().min(5),
  surfaceArea: z.number().positive(),
  bedrooms: z.number().int().nonnegative(),
  bathrooms: z.number().int().nonnegative(),
  status: z.nativeEnum(PropertyStatus).default(PropertyStatus.AVAILABLE),
  isFeatured: z.boolean().default(false),
  coverImage: z.string().url(),
  energyRating: z.string().optional(),
  yearBuilt: z.number().int().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    order: z.number().default(0),
    isCover: z.boolean().default(false),
  })).optional(),
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

export const getProperties = async (req: Request, res: Response): Promise<void> => {
  const {
    search,
    type,
    transactionType,
    city,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    status,
    isFeatured,
    sort = 'newest',
    page = '1',
    limit = '9',
  } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 9;
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
      { city: { contains: search as string, mode: 'insensitive' } },
      { neighborhood: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  if (type) where.type = type as PropertyType;
  if (transactionType) where.transactionType = transactionType as TransactionType;
  if (city) where.city = { contains: city as string, mode: 'insensitive' };
  if (status) where.status = status as PropertyStatus;
  else where.status = { not: PropertyStatus.DRAFT }; // Public default

  if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice as string);
    if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
  }

  if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms as string, 10) };
  if (bathrooms) where.bathrooms = { gte: parseInt(bathrooms as string, 10) };

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'priceAsc') orderBy = { price: 'asc' };
  if (sort === 'priceDesc') orderBy = { price: 'desc' };
  if (sort === 'surfaceDesc') orderBy = { surfaceArea: 'desc' };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      include: {
        images: { orderBy: { order: 'asc' } },
        features: true,
      },
    }),
    prisma.property.count({ where }),
  ]);

  res.json({
    success: true,
    data: properties,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};

export const getPropertyBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  const property = await prisma.property.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      features: true,
    },
  });

  if (!property) {
    res.status(404).json({ success: false, message: 'Propriété introuvable.' });
    return;
  }

  // Similar properties
  const similar = await prisma.property.findMany({
    where: {
      id: { not: property.id },
      city: property.city,
      status: PropertyStatus.AVAILABLE,
    },
    take: 3,
    include: { images: true },
  });

  res.json({
    success: true,
    data: property,
    similar,
  });
};

export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const data = propertyCreateSchema.parse(req.body);
  const baseSlug = slugify(data.title);
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const property = await prisma.property.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      type: data.type,
      transactionType: data.transactionType,
      price: data.price,
      currency: data.currency,
      city: data.city,
      neighborhood: data.neighborhood,
      address: data.address,
      surfaceArea: data.surfaceArea,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      status: data.status,
      isFeatured: data.isFeatured,
      coverImage: data.coverImage,
      energyRating: data.energyRating,
      yearBuilt: data.yearBuilt,
      features: data.features ? {
        create: data.features.map(f => ({ name: f })),
      } : undefined,
      images: data.images ? {
        create: data.images.map((img, i) => ({
          url: img.url,
          alt: img.alt || data.title,
          order: img.order || i,
          isCover: img.isCover || i === 0,
        })),
      } : undefined,
    },
    include: {
      images: true,
      features: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user?.id,
      action: 'PROPERTY_CREATED',
      entityType: 'Property',
      entityId: property.id,
      details: `Création du bien : "${property.title}" (${property.city})`,
    },
  });

  res.status(201).json({ success: true, data: property });
};

export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body;

  const existing = await prisma.property.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ success: false, message: 'Propriété introuvable.' });
    return;
  }

  // Handle features replacement if provided
  if (data.features && Array.isArray(data.features)) {
    await prisma.propertyFeature.deleteMany({ where: { propertyId: id } });
    await prisma.propertyFeature.createMany({
      data: data.features.map((f: string) => ({ propertyId: id, name: f })),
    });
    delete data.features;
  }

  const updated = await prisma.property.update({
    where: { id },
    data,
    include: { images: true, features: true },
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user?.id,
      action: 'PROPERTY_UPDATED',
      entityType: 'Property',
      entityId: id,
      details: `Mise à jour du bien : "${updated.title}"`,
    },
  });

  res.json({ success: true, data: updated });
};

export const deleteProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) {
    res.status(404).json({ success: false, message: 'Propriété introuvable.' });
    return;
  }

  await prisma.property.delete({ where: { id } });

  await prisma.activityLog.create({
    data: {
      userId: req.user?.id,
      action: 'PROPERTY_DELETED',
      entityType: 'Property',
      entityId: id,
      details: `Suppression du bien "${property.title}"`,
    },
  });

  res.json({ success: true, message: 'Propriété supprimée avec succès.' });
};
