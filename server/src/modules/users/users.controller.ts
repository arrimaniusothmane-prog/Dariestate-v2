import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.js';
import { UserRole } from '../../types/enums.js';

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
      isEmailVerified: true,
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
      isEmailVerified: true,
      createdAt: true,
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
      isEmailVerified: true,
      createdAt: true,
    },
  });

  res.json({ success: true, data: user });
};

export const updateMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Non authentifié.' });
    return;
  }

  const { name, phone, avatar } = req.body;

  const updateData: any = {};
  if (name) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (avatar) updateData.avatar = avatar;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      isActive: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  res.json({ success: true, data: user });
};

export const changeMyPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Non authentifié.' });
    return;
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ success: false, message: 'Mot de passe actuel et nouveau mot de passe requis.' });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ success: false, message: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    return;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect.' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash },
  });

  res.json({ success: true, message: 'Mot de passe modifié avec succès.' });
};

export const deleteMyAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Non authentifié.' });
    return;
  }

  const { password } = req.body;

  if (!password) {
    res.status(400).json({ success: false, message: 'Mot de passe requis pour supprimer le compte.' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Mot de passe incorrect.' });
    return;
  }

  await prisma.user.delete({
    where: { id: req.user.id },
  });

  res.json({ success: true, message: 'Compte supprimé avec succès.' });
};
