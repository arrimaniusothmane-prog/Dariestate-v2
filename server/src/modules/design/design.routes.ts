import { Router } from 'express';
import {
  getDesignProjects,
  getDesignProjectBySlug,
  createDesignProject,
  updateDesignProject,
  deleteDesignProject,
} from './design.controller.js';
import { authenticate, requireRoles } from '../../middleware/auth.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.get('/', getDesignProjects);
router.get('/:slug', getDesignProjectBySlug);

router.post(
  '/',
  authenticate,
  requireRoles([UserRole.ADMIN, UserRole.INTERIOR_DESIGNER]),
  createDesignProject
);
router.patch(
  '/:id',
  authenticate,
  requireRoles([UserRole.ADMIN, UserRole.INTERIOR_DESIGNER]),
  updateDesignProject
);
router.delete(
  '/:id',
  authenticate,
  requireRoles([UserRole.ADMIN]),
  deleteDesignProject
);

export default router;
