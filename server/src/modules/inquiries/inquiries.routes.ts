import { Router } from 'express';
import { createInquiry, getInquiries, updateInquiry } from './inquiries.controller.js';
import { authenticate, requireRoles } from '../../middleware/auth.js';
import { UserRole } from '../../types/enums.js';

const router = Router();

// Public inquiry submission
router.post('/', createInquiry);

// Staff access
router.get(
  '/',
  authenticate,
  requireRoles([UserRole.ADMIN, UserRole.AGENT, UserRole.SALES_REP]),
  getInquiries
);
router.patch(
  '/:id',
  authenticate,
  requireRoles([UserRole.ADMIN, UserRole.AGENT, UserRole.SALES_REP]),
  updateInquiry
);

export default router;
