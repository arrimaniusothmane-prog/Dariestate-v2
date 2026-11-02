import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';
import { UserRole } from '@prisma/client';

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatar: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: users });
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, phone, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    res.status(400).json({ success: false, message: 'Cet email est déjà utilisé.' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password || 'TemporaryPassword2025!', salt);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      role: (role as UserRole) || UserRole.AGENT,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
    },
  });

  res.status(201).json({ success: true, data: user });
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, phone, role, isActive, password } = req.body;

  const updateData: any = {};
  if (name) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (role) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateData.passwordHash = await bcrypt.hash(password, salt);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
    },
  });

  res.json({ success: true, data: user });
};
