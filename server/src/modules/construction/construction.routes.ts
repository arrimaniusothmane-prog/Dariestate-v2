import { Router } from 'express';
import {
  getConstructionProjects,
  getConstructionProjectById,
  createConstructionProject,
  updateConstructionProject,
  toggleMilestone,
} from './construction.controller.js';
import { authenticate, requireRoles } from '../../middleware/auth.js';
import { UserRole } from '../../types/enums.js';

const router = Router();

// Public read routes
router.get('/', getConstructionProjects);
router.get('/:id', getConstructionProjectById);

// Staff management
router.post(
  '/',
  authenticate,
  requireRoles([UserRole.ADMIN, UserRole.CONSTRUCTION_MANAGER]),
  createConstructionProject
);
router.patch(
  '/:id',
  authenticate,
  requireRoles([UserRole.ADMIN, UserRole.CONSTRUCTION_MANAGER]),
  updateConstructionProject
);
router.patch(
  '/milestones/:milestoneId',
  authenticate,
  requireRoles([UserRole.ADMIN, UserRole.CONSTRUCTION_MANAGER]),
  toggleMilestone
);

export default router;
