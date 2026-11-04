import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { UserRole } from '../types/enums.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Non authentifié. Jeton manquant.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string; role: UserRole };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'Utilisateur inactif ou introuvable.' });
      return;
    }

    req.user = { ...user, role: user.role as UserRole };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Jeton invalide ou expiré.' });
  }
};

/**
 * Attaches the current user when a valid token is present, but never blocks
 * anonymous traffic. Useful for public pages that also support staff previews.
 */
export const optionalAuthenticate = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string; role: UserRole };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true, isActive: true },
    });
    if (user?.isActive) {
      req.user = { ...user, role: user.role as UserRole };
    }
  } catch {
    // Invalid tokens are simply treated as anonymous visitors.
  }
  next();
};

export const requireRoles = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentification requise.' });
      return;
    }

    // SUPER_ADMIN has access to everything
    if (req.user.role === UserRole.SUPER_ADMIN || allowedRoles.includes(req.user.role)) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: 'Accès refusé : autorisations insuffisantes pour cette opération.',
    });
  };
};
