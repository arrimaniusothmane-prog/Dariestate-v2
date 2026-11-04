import { Router } from 'express';
import { getSettings, updateSettings } from './settings.controller.js';
import { authenticate, requireRoles } from '../../middleware/auth.js';
import { UserRole } from '../../types/enums.js';

const router = Router();

// Public
router.get('/', getSettings);

// Admin only
router.patch(
  '/',
  authenticate,
  requireRoles([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  updateSettings
);

export default router;
