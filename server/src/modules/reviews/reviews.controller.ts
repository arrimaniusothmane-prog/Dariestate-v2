import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  const reviews = await prisma.review.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: reviews });
};

export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  const [
    totalProperties,
    availableProperties,
    totalInquiries,
    newInquiries,
    totalQuotes,
    pendingQuotes,
    activeConstructionProjects,
    recentActivities,
    propertiesByType,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: 'AVAILABLE' } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: 'PENDING' } }),
    prisma.constructionProject.count({ where: { status: { not: 'COMPLETED' } } }),
    prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, role: true } } },
    }),
    prisma.property.groupBy({
      by: ['type'],
      _count: { id: true },
    }),
  ]);

  res.json({
    success: true,
    data: {
      kpis: {
        totalProperties,
        availableProperties,
        totalInquiries,
        newInquiries,
        totalQuotes,
        pendingQuotes,
        activeConstructionProjects,
      },
      recentActivities,
      propertiesByType: propertiesByType.map((item) => ({
        type: item.type,
        count: item._count.id,
      })),
    },
  });
};
