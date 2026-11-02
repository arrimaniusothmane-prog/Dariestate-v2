import { Router } from 'express';
import {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
} from './properties.controller.js';
import { authenticate, requireRoles } from '../../middleware/auth.js';
import { UserRole } from '@prisma/client';

const router = Router();

// Public routes
router.get('/', getProperties);
router.get('/:slug', getPropertyBySlug);

// Protected staff routes
router.post(
  '/',
  authenticate,
  requireRoles([UserRole.ADMIN, UserRole.AGENT]),
  createProperty
);
router.patch(
  '/:id',
  authenticate,
  requireRoles([UserRole.ADMIN, UserRole.AGENT]),
  updateProperty
);
router.delete(
  '/:id',
  authenticate,
  requireRoles([UserRole.ADMIN]),
  deleteProperty
);

export default router;
