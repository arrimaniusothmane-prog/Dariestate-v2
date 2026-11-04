import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../config/prisma.js';
import { config } from '../../config/env.js';
import { AuthRequest } from '../../middleware/auth.js';
import { sendEmail, generateVerificationToken, generateResetToken } from '../../config/email.js';
import { emailTemplates } from '../../templates/emails.js';

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

  // Check email verification
  if (!user.isEmailVerified) {
    res.status(403).json({
      success: false,
      message: 'Veuillez vérifier votre adresse email avant de vous connecter.',
      requiresVerification: true,
    });
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
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
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

  const verificationToken = generateVerificationToken();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      role: 'CLIENT',
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      avatar: true,
      isActive: true,
      isEmailVerified: true,
    },
  });

  // Send verification email
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
  const emailSent = await sendEmail(
    user.email,
    'Vérifiez votre adresse email - DAR & ATELIER',
    emailTemplates.verification(user.name, verificationUrl)
  );

  if (!emailSent) {
    console.warn('Verification email failed to send, but user was created');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    success: true,
    token,
    user,
    message: 'Compte créé avec succès. Veuillez vérifier votre adresse email.',
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
      isActive: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });

  res.json({ success: true, user });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Déconnexion effectuée avec succès.' });
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    res.status(400).json({ success: false, message: 'Token de vérification manquant.' });
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: token,
      emailVerificationExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    res.status(400).json({ success: false, message: 'Token invalide ou expiré.' });
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  // Send welcome email
  await sendEmail(
    user.email,
    'Bienvenue sur DAR & ATELIER',
    emailTemplates.welcome(user.name)
  );

  res.json({ success: true, message: 'Adresse email vérifiée avec succès.' });
};

export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ success: false, message: 'Adresse email requise.' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    return;
  }

  if (user.isEmailVerified) {
    res.status(400).json({ success: false, message: 'Cette adresse email est déjà vérifiée.' });
    return;
  }

  const verificationToken = generateVerificationToken();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    },
  });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;
  const emailSent = await sendEmail(
    user.email,
    'Vérifiez votre adresse email - DAR & ATELIER',
    emailTemplates.verification(user.name, verificationUrl)
  );

  if (!emailSent) {
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de l\'email.' });
    return;
  }

  res.json({ success: true, message: 'Email de vérification renvoyé avec succès.' });
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ success: false, message: 'Adresse email requise.' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Don't reveal if user exists for security
    res.json({ success: true, message: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation.' });
    return;
  }

  const resetToken = generateResetToken();
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    },
  });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
  const emailSent = await sendEmail(
    user.email,
    'Réinitialisation de mot de passe - DAR & ATELIER',
    emailTemplates.passwordReset(user.name, resetUrl)
  );

  if (!emailSent) {
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de l\'email.' });
    return;
  }

  res.json({ success: true, message: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation.' });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ success: false, message: 'Token et mot de passe requis.' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ success: false, message: 'Le mot de passe doit comporter au moins 8 caractères.' });
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    res.status(400).json({ success: false, message: 'Token invalide ou expiré.' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  res.json({ success: true, message: 'Mot de passe réinitialisé avec succès.' });
};
