import { Router } from 'express';
import {
  getProperties,
  getAdminProperties,
  getAdminPropertyById,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
  duplicateProperty,
  publishProperty,
  unpublishProperty,
  setPropertyStatus,
} from './properties.controller.js';
import { authenticate, optionalAuthenticate, requireRoles } from '../../middleware/auth.js';
import { UserRole } from '../../types/enums.js';

const router = Router();
const staff = [UserRole.ADMIN, UserRole.AGENT, UserRole.SALES_REP];

// Public routes
router.get('/', getProperties);

// Protected administration routes (must be declared before /:slug)
router.get('/admin/all', authenticate, requireRoles(staff), getAdminProperties);
router.get('/admin/:id', authenticate, requireRoles(staff), getAdminPropertyById);

// Public detail route with optional staff preview for unpublished drafts
router.get('/:slug', optionalAuthenticate, getPropertyBySlug);

// Protected mutations
router.post('/', authenticate, requireRoles(staff), createProperty);
router.patch('/:id', authenticate, requireRoles(staff), updateProperty);
router.delete('/:id', authenticate, requireRoles([UserRole.ADMIN]), deleteProperty);
router.post('/:id/duplicate', authenticate, requireRoles(staff), duplicateProperty);
router.patch('/:id/publish', authenticate, requireRoles(staff), publishProperty);
router.patch('/:id/unpublish', authenticate, requireRoles(staff), unpublishProperty);
router.patch('/:id/status', authenticate, requireRoles(staff), setPropertyStatus);

export default router;
