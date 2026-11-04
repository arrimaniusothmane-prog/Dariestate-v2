import { Router } from 'express';
import { login, register, getMe, logout, verifyEmail, resendVerification, requestPasswordReset, resetPassword } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authLimiter, passwordResetLimiter, emailVerificationLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Apply strict rate limiting to sensitive auth endpoints
router.post('/login', authLimiter, login);
router.post('/register', authLimiter, register);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.get('/verify-email', emailVerificationLimiter, verifyEmail);
router.post('/resend-verification', emailVerificationLimiter, resendVerification);
router.post('/request-password-reset', passwordResetLimiter, requestPasswordReset);
router.post('/reset-password', passwordResetLimiter, resetPassword);

export default router;
