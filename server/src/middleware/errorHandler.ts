import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('[API Error]:', err?.message || err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Erreur de validation des données transmises.',
      errors: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
    });
    return;
  }

  // Handle Prisma Database Connection / Initialization Errors
  if (err?.name === 'PrismaClientInitializationError' || err?.code === 'P1001') {
    res.status(503).json({
      success: false,
      message: 'Service temporairement indisponible : la base de données PostgreSQL est inaccessible. Veuillez vérifier que PostgreSQL est démarré.',
      code: 'DATABASE_UNAVAILABLE',
    });
    return;
  }

  // Handle Prisma Known Request Errors
  if (err?.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'Une entrée avec ces informations existe déjà (conflit d\'unicité).',
        code: 'UNIQUE_CONSTRAINT_VIOLATION',
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Enregistrement introuvable.',
        code: 'NOT_FOUND',
      });
      return;
    }
  }

  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Une erreur interne est survenue sur le serveur.',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
