import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'DAR & ATELIER <noreply@dar-atelier.ma>',
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const generateVerificationToken = (): string => {
  return randomBytes(32).toString('hex');
};

export const generateResetToken = (): string => {
  return randomBytes(32).toString('hex');
};
