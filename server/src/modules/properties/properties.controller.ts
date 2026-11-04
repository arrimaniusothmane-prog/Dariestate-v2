import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';
import {
  PropertyType,
  TransactionType,
  PropertyStatus,
  PropertyCondition,
  PropertyStatus as PropertyStatusValues,
  UserRole,
} from '../../types/enums.js';

const MEDIA_REF = /^(\/uploads\/|https?:\/\/)/i;
const mediaUrl = z
  .string()
  .trim()
  .min(1, 'Une URL de média est requise')
  .max(2048)
  .refine((value) => MEDIA_REF.test(value), 'URL de média invalide');

const optionalMediaUrl = z
  .string()
  .trim()
  .max(2048)
  .optional()
  .nullable()
  .refine((value) => !value || MEDIA_REF.test(value), 'URL de média invalide');

const propertyImageSchema = z.object({
  url: mediaUrl,
  alt: z.string().trim().max(180).optional(),
  caption: z.string().trim().max(220).optional(),
  order: z.coerce.number().int().nonnegative().optional(),
  isCover: z.boolean().optional(),
});

const propertyInputSchema = z.object({
  title: z.string().trim().min(5, 'Le titre doit comporter au moins 5 caractères').max(180),
  description: z.string().trim().min(20, 'La description doit comporter au moins 20 caractères').max(12000),
  type: z.nativeEnum(PropertyType),
  transactionType: z.nativeEnum(TransactionType),
  price: z.coerce.number().positive('Le prix doit être positif').max(1_000_000_000_000),
  currency: z.string().trim().min(3).max(8).default('MAD'),
  city: z.string().trim().min(2, 'La ville est requise').max(80),
  neighborhood: z.string().trim().min(1, 'Le quartier est requis').max(120),
  address: z.string().trim().min(5, "L'adresse est requise").max(300),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  surfaceArea: z.coerce.number().positive("La surface doit être positive"),
  landArea: z.coerce.number().nonnegative().optional().nullable(),
  bedrooms: z.coerce.number().int().nonnegative().max(100).default(0),
  bathrooms: z.coerce.number().int().nonnegative().max(100).default(0),
  floors: z.coerce.number().int().nonnegative().max(200).default(0),
  garage: z.boolean().default(false),
  garden: z.boolean().default(false),
  swimmingPool: z.boolean().default(false),
  terrace: z.boolean().default(false),
  furnished: z.boolean().default(false),
  condition: z.nativeEnum(PropertyCondition).default('NEW'),
  constructionYear: z.coerce.number().int().min(1800).max(2100).optional().nullable(),
  status: z.nativeEnum(PropertyStatus).default('DRAFT'),
  availability: z.nativeEnum(PropertyStatus).optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  coverImage: mediaUrl,
  videoUrl: optionalMediaUrl,
  energyRating: z.string().trim().max(10).optional().nullable(),
  yearBuilt: z.coerce.number().int().min(1800).max(2100).optional().nullable(),
  metaTitle: z.string().trim().max(180).optional().nullable(),
  metaDescription: z.string().trim().max(320).optional().nullable(),
  features: z.array(z.string().trim().min(1).max(120)).max(80).default([]),
  images: z.array(propertyImageSchema).max(40).default([]),
});

const propertyUpdateSchema = propertyInputSchema.partial();

type PropertyPayload = z.infer<typeof propertyInputSchema>;

const TYPE_PREFIX: Record<string, string> = {
  VILLA: 'V',
  APARTMENT: 'A',
  HOUSE: 'M',
  LAND: 'T',
  COMMERCIAL: 'C',
  OFFICE: 'O',
  PENTHOUSE: 'P',
  DUPLEX: 'D',
};

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
  const base = slugify(title) || 'bien-immobilier';
  let slug = base;
  let counter = 2;
  while (await prisma.property.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

async function uniqueReference(type: string): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = TYPE_PREFIX[type] || 'B';
  let counter = await prisma.property.count({ where: { reference: { startsWith: `DAR-${prefix}-${year}-` } } }) + 1;
  let reference = `DAR-${prefix}-${year}-${String(counter).padStart(4, '0')}`;
  while (await prisma.property.findUnique({ where: { reference } })) {
    counter += 1;
    reference = `DAR-${prefix}-${year}-${String(counter).padStart(4, '0')}`;
  }
  return reference;
}

function normalizeImages(payload: PropertyPayload) {
  const images = payload.images.length
    ? payload.images
    : [{ url: payload.coverImage, alt: payload.title, order: 0, isCover: true }];

  const coverIndex = Math.max(
    0,
    images.findIndex((image) => image.isCover || image.url === payload.coverImage)
  );

  return images.map((image, index) => ({
    url: image.url,
    alt: image.alt || payload.title,
    caption: image.caption || null,
    order: index,
    isCover: index === coverIndex,
  }));
}

function normalizePublication(data: { status?: string; isPublished?: boolean }) {
  const requestedStatus = data.status || 'DRAFT';
  const isPublished = Boolean(data.isPublished) && requestedStatus !== 'DRAFT';
  return {
    status: requestedStatus,
    availability: requestedStatus === 'DRAFT' ? 'AVAILABLE' : requestedStatus,
    isPublished,
  };
}

function selectData(payload: PropertyPayload, publication: ReturnType<typeof normalizePublication>) {
  return {
    title: payload.title,
    description: payload.description,
    type: payload.type,
    transactionType: payload.transactionType,
    price: payload.price,
    currency: payload.currency,
    city: payload.city,
    neighborhood: payload.neighborhood,
    address: payload.address,
    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,
    surfaceArea: payload.surfaceArea,
    landArea: payload.landArea ?? null,
    bedrooms: payload.bedrooms,
    bathrooms: payload.bathrooms,
    floors: payload.floors,
    garage: payload.garage,
    garden: payload.garden,
    swimmingPool: payload.swimmingPool,
    terrace: payload.terrace,
    furnished: payload.furnished,
    condition: payload.condition,
    constructionYear: payload.constructionYear ?? payload.yearBuilt ?? null,
    yearBuilt: payload.yearBuilt ?? payload.constructionYear ?? null,
    status: publication.status,
    availability: publication.availability,
    isPublished: publication.isPublished,
    isFeatured: payload.isFeatured,
    coverImage: payload.coverImage,
    videoUrl: payload.videoUrl || null,
    energyRating: payload.energyRating || null,
    metaTitle: payload.metaTitle || null,
    metaDescription: payload.metaDescription || null,
    publishedAt: publication.isPublished ? new Date() : null,
  };
}

const fullInclude = {
  images: { orderBy: { order: 'asc' as const } },
  features: true,
};

const staffRoles: string[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.AGENT,
  UserRole.SALES_REP,
];

function isStaff(req: AuthRequest): boolean {
  return Boolean(req.user && staffRoles.includes(req.user.role));
}

function parseBoolean(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
}

function buildPublicWhere(query: Request['query']) {
  const { search, type, transactionType, city, neighborhood, minPrice, maxPrice, bedrooms, bathrooms, minSurface, isFeatured } = query;
  const and: any[] = [
    { isPublished: true },
    { status: { not: PropertyStatusValues.DRAFT } },
  ];

  if (search && String(search).trim()) {
    const term = String(search).trim();
    and.push({
      OR: [
        { title: { contains: term } },
        { description: { contains: term } },
        { city: { contains: term } },
        { neighborhood: { contains: term } },
        { address: { contains: term } },
        { reference: { contains: term } },
      ],
    });
  }
  if (type && type !== 'ALL') and.push({ type: String(type) });
  if (transactionType && transactionType !== 'ALL') and.push({ transactionType: String(transactionType) });
  if (city && city !== 'ALL') and.push({ city: { contains: String(city) } });
  if (neighborhood) and.push({ neighborhood: { contains: String(neighborhood) } });
  if (bedrooms) and.push({ bedrooms: { gte: parseInt(String(bedrooms), 10) || 0 } });
  if (bathrooms) and.push({ bathrooms: { gte: parseInt(String(bathrooms), 10) || 0 } });
  if (minSurface) and.push({ surfaceArea: { gte: parseFloat(String(minSurface)) || 0 } });
  if (minPrice || maxPrice) {
    const price: any = {};
    if (minPrice) price.gte = parseFloat(String(minPrice));
    if (maxPrice) price.lte = parseFloat(String(maxPrice));
    and.push({ price });
  }
  if (isFeatured !== undefined) and.push({ isFeatured: parseBoolean(isFeatured) });

  return { AND: and };
}

function buildAdminWhere(query: Request['query']) {
  const { search, type, transactionType, city, status, isPublished, isFeatured } = query;
  const and: any[] = [];
  if (search && String(search).trim()) {
    const term = String(search).trim();
    and.push({
      OR: [
        { title: { contains: term } },
        { description: { contains: term } },
        { city: { contains: term } },
        { neighborhood: { contains: term } },
        { address: { contains: term } },
        { reference: { contains: term } },
      ],
    });
  }
  if (type && type !== 'ALL') and.push({ type: String(type) });
  if (transactionType && transactionType !== 'ALL') and.push({ transactionType: String(transactionType) });
  if (city && city !== 'ALL') and.push({ city: { contains: String(city) } });
  if (status && status !== 'ALL') and.push({ status: String(status) });
  if (isPublished !== undefined) and.push({ isPublished: parseBoolean(isPublished) });
  if (isFeatured !== undefined) and.push({ isFeatured: parseBoolean(isFeatured) });
  return and.length ? { AND: and } : {};
}

function buildOrderBy(sort: unknown): any {
  switch (sort) {
    case 'oldest':
      return { createdAt: 'asc' };
    case 'priceAsc':
      return { price: 'asc' };
    case 'priceDesc':
      return { price: 'desc' };
    case 'surfaceDesc':
      return { surfaceArea: 'desc' };
    case 'titleAsc':
      return { title: 'asc' };
    case 'referenceAsc':
      return { reference: 'asc' };
    default:
      return { createdAt: 'desc' };
  }
}

export const getProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  const pageNum = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '9'), 10) || 9));
  const where = buildPublicWhere(req.query);
  const orderBy = buildOrderBy(req.query.sort);

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      include: fullInclude,
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

export const getAdminProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  const pageNum = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
  const limitNum = Math.min(500, Math.max(1, parseInt(String(req.query.limit || '100'), 10) || 100));
  const where = buildAdminWhere(req.query);
  const orderBy = buildOrderBy(req.query.sort);

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      include: fullInclude,
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

export const getAdminPropertyById = async (req: AuthRequest, res: Response): Promise<void> => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id },
    include: fullInclude,
  });
  if (!property) {
    res.status(404).json({ success: false, message: 'Propriété introuvable.' });
    return;
  }
  res.json({ success: true, data: property });
};

export const getPropertyBySlug = async (req: AuthRequest, res: Response): Promise<void> => {
  const property = await prisma.property.findUnique({
    where: { slug: req.params.slug },
    include: fullInclude,
  });

  if (!property || ((!property.isPublished || property.status === PropertyStatusValues.DRAFT) && !isStaff(req))) {
    res.status(404).json({ success: false, message: 'Propriété introuvable ou non publiée.' });
    return;
  }

  const similar = await prisma.property.findMany({
    where: {
      id: { not: property.id },
      isPublished: true,
      status: { not: PropertyStatusValues.DRAFT },
      OR: [{ city: property.city }, { type: property.type }],
    },
    take: 3,
    orderBy: { isFeatured: 'desc' },
    include: { images: { orderBy: { order: 'asc' } }, features: true },
  });

  res.json({ success: true, data: property, similar });
};

export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const payload = propertyInputSchema.parse(req.body);
  const publication = normalizePublication(payload);
  const slug = await uniqueSlug(payload.title);
  const reference = await uniqueReference(payload.type);
  const images = normalizeImages(payload);

  const property = await prisma.property.create({
    data: {
      ...selectData(payload, publication),
      slug,
      reference,
      images: { create: images },
      features: {
        create: payload.features.map((name) => ({ name })),
      },
    },
    include: fullInclude,
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user?.id,
      action: 'PROPERTY_CREATED',
      entityType: 'Property',
      entityId: property.id,
      details: `Création du bien ${property.reference} : "${property.title}" (${property.city})`,
    },
  });

  res.status(201).json({ success: true, data: property });
};

export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const payload = propertyUpdateSchema.parse(req.body);

  const existing = await prisma.property.findUnique({ where: { id }, include: fullInclude });
  if (!existing) {
    res.status(404).json({ success: false, message: 'Propriété introuvable.' });
    return;
  }

  const submitted = new Set(Object.keys(req.body || {}));
  const data: any = {};
  const managedKeys = new Set([
    'images',
    'features',
    'videoUrl',
    'metaTitle',
    'metaDescription',
    'latitude',
    'longitude',
    'landArea',
    'energyRating',
    'yearBuilt',
    'constructionYear',
    'status',
    'isPublished',
    'availability',
    'publishedAt',
    'coverImage',
  ]);

  for (const [key, value] of Object.entries(payload)) {
    if (submitted.has(key) && !managedKeys.has(key)) {
      data[key] = value;
    }
  }

  if (submitted.has('videoUrl')) data.videoUrl = payload.videoUrl || null;
  if (submitted.has('metaTitle')) data.metaTitle = payload.metaTitle || null;
  if (submitted.has('metaDescription')) data.metaDescription = payload.metaDescription || null;
  if (submitted.has('latitude')) data.latitude = payload.latitude ?? null;
  if (submitted.has('longitude')) data.longitude = payload.longitude ?? null;
  if (submitted.has('landArea')) data.landArea = payload.landArea ?? null;
  if (submitted.has('energyRating')) data.energyRating = payload.energyRating || null;
  if (submitted.has('yearBuilt')) data.yearBuilt = payload.yearBuilt ?? null;
  if (submitted.has('constructionYear')) data.constructionYear = payload.constructionYear ?? null;

  if (submitted.has('status') || submitted.has('isPublished')) {
    const status = submitted.has('status') ? payload.status ?? existing.status : existing.status;
    const isPublished = submitted.has('isPublished') ? Boolean(payload.isPublished) : existing.isPublished;
    const publication = normalizePublication({ status, isPublished });
    data.status = publication.status;
    data.availability = publication.availability;
    data.isPublished = publication.isPublished;
    data.publishedAt = publication.isPublished ? existing.publishedAt || new Date() : null;
  }

  if (submitted.has('coverImage') && !submitted.has('images') && payload.coverImage) {
    const images = existing.images.map((image) => ({
      url: image.url,
      alt: image.alt,
      caption: image.caption,
      order: image.order,
      isCover: image.url === payload.coverImage,
    }));
    if (!images.some((image) => image.isCover)) {
      images.unshift({
        url: payload.coverImage,
        alt: payload.title || existing.title,
        caption: null,
        order: 0,
        isCover: true,
      });
    }
    data.images = { deleteMany: {}, create: images.map((image, index) => ({ ...image, order: index })) };
    data.coverImage = payload.coverImage;
  }

  if (submitted.has('images') && payload.images) {
    if (payload.images.length > 0) {
      const normalized = normalizeImages({
        ...(payload as PropertyPayload),
        title: payload.title || existing.title,
        coverImage: payload.coverImage || existing.coverImage,
        images: payload.images,
      });
      data.images = { deleteMany: {}, create: normalized };
      data.coverImage = normalized.find((image) => image.isCover)?.url || normalized[0].url;
    } else {
      data.images = { deleteMany: {} };
    }
  }

  if (submitted.has('features') && payload.features) {
    data.features = {
      deleteMany: {},
      create: payload.features.map((name) => ({ name })),
    };
  }

  const updated = await prisma.property.update({
    where: { id },
    data,
    include: fullInclude,
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user?.id,
      action: 'PROPERTY_UPDATED',
      entityType: 'Property',
      entityId: id,
      details: `Mise à jour du bien ${updated.reference} : "${updated.title}"`,
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
      details: `Suppression du bien ${property.reference} : "${property.title}"`,
    },
  });

  res.json({ success: true, message: 'Propriété supprimée avec succès.' });
};

export const duplicateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const source = await prisma.property.findUnique({
    where: { id: req.params.id },
    include: fullInclude,
  });
  if (!source) {
    res.status(404).json({ success: false, message: 'Propriété introuvable.' });
    return;
  }

  const title = `${source.title} (copie)`;
  const slug = await uniqueSlug(title);
  const reference = await uniqueReference(source.type);

  const duplicate = await prisma.property.create({
    data: {
      reference,
      title,
      slug,
      description: source.description,
      type: source.type,
      transactionType: source.transactionType,
      price: source.price,
      currency: source.currency,
      city: source.city,
      neighborhood: source.neighborhood,
      address: source.address,
      latitude: source.latitude,
      longitude: source.longitude,
      surfaceArea: source.surfaceArea,
      landArea: source.landArea,
      bedrooms: source.bedrooms,
      bathrooms: source.bathrooms,
      floors: source.floors,
      garage: source.garage,
      garden: source.garden,
      swimmingPool: source.swimmingPool,
      terrace: source.terrace,
      furnished: source.furnished,
      condition: source.condition,
      constructionYear: source.constructionYear,
      availability: 'AVAILABLE',
      status: PropertyStatusValues.DRAFT,
      isPublished: false,
      isFeatured: false,
      coverImage: source.coverImage,
      videoUrl: source.videoUrl,
      energyRating: source.energyRating,
      yearBuilt: source.yearBuilt,
      metaTitle: source.metaTitle,
      metaDescription: source.metaDescription,
      images: {
        create: source.images.map((image) => ({
          url: image.url,
          alt: image.alt,
          caption: image.caption,
          order: image.order,
          isCover: image.isCover,
        })),
      },
      features: {
        create: source.features.map((feature) => ({ name: feature.name, category: feature.category })),
      },
    },
    include: fullInclude,
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user?.id,
      action: 'PROPERTY_DUPLICATED',
      entityType: 'Property',
      entityId: duplicate.id,
      details: `Duplication du bien ${source.reference} vers ${duplicate.reference}`,
    },
  });

  res.status(201).json({ success: true, data: duplicate });
};

export const publishProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const existing = await prisma.property.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ success: false, message: 'Propriété introuvable.' });
    return;
  }

  const status = existing.status === PropertyStatusValues.DRAFT ? PropertyStatusValues.AVAILABLE : existing.status;
  const property = await prisma.property.update({
    where: { id: req.params.id },
    data: {
      isPublished: true,
      status,
      availability: status,
      publishedAt: existing.publishedAt || new Date(),
    },
    include: fullInclude,
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user?.id,
      action: 'PROPERTY_PUBLISHED',
      entityType: 'Property',
      entityId: property.id,
      details: `Publication du bien ${property.reference} : "${property.title}"`,
    },
  });

  res.json({ success: true, data: property });
};

export const unpublishProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const existing = await prisma.property.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ success: false, message: 'Propriété introuvable.' });
    return;
  }

  const property = await prisma.property.update({
    where: { id: req.params.id },
    data: { isPublished: false, publishedAt: null },
    include: fullInclude,
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user?.id,
      action: 'PROPERTY_UNPUBLISHED',
      entityType: 'Property',
      entityId: property.id,
      details: `Dépublication du bien ${property.reference} : "${property.title}"`,
    },
  });

  res.json({ success: true, data: property });
};

export const setPropertyStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const schema = z.object({ status: z.nativeEnum(PropertyStatus) });
  const { status } = schema.parse(req.body);

  const existing = await prisma.property.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ success: false, message: 'Propriété introuvable.' });
    return;
  }

  const property = await prisma.property.update({
    where: { id: req.params.id },
    data: {
      status,
      availability: status === PropertyStatusValues.DRAFT ? 'AVAILABLE' : status,
      isPublished: status === PropertyStatusValues.DRAFT ? false : existing.isPublished,
      publishedAt: status === PropertyStatusValues.DRAFT ? null : existing.publishedAt,
    },
    include: fullInclude,
  });

  await prisma.activityLog.create({
    data: {
      userId: req.user?.id,
      action: status === PropertyStatusValues.SOLD ? 'PROPERTY_MARKED_SOLD' : status === PropertyStatusValues.RENTED ? 'PROPERTY_MARKED_RENTED' : 'PROPERTY_STATUS_UPDATED',
      entityType: 'Property',
      entityId: property.id,
      details: `Statut du bien ${property.reference} modifié en ${status}`,
    },
  });

  res.json({ success: true, data: property });
};
