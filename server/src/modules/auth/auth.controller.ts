import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { config } from '../../config/env.js';
import { AuthRequest } from '../../middleware/auth.js';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit comporter au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit comporter au moins 8 caractères'),
  phone: z.string().optional(),
});

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user || !user.isActive) {
    res.status(401).json({ success: false, message: 'Identifiants incorrects ou compte inactif.' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user.id,
      details: `Connexion réussie pour ${user.name} (${user.role})`,
    },
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
    },
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phone } = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    res.status(400).json({ success: false, message: 'Un compte existe déjà avec cette adresse email.' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      role: 'CLIENT',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
    },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    token,
    user,
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Non authentifié.' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      createdAt: true,
    },
  });

  res.json({ success: true, user });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Déconnexion effectuée avec succès.' });
};
