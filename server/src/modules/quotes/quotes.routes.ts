import { Router } from 'express';
import { createQuoteRequest, getQuoteRequests, updateQuoteRequest } from './quotes.controller.js';
import { authenticate, requireRoles } from '../../middleware/auth.js';
import { UserRole } from '../../types/enums.js';

const router = Router();

// Public quote submission
router.post('/', createQuoteRequest);

// Staff management
router.get(
  '/',
  authenticate,
  requireRoles([UserRole.ADMIN, UserRole.CONSTRUCTION_MANAGER, UserRole.INTERIOR_DESIGNER, UserRole.SALES_REP]),
  getQuoteRequests
);
router.patch(
  '/:id',
  authenticate,
  requireRoles([UserRole.ADMIN, UserRole.CONSTRUCTION_MANAGER, UserRole.INTERIOR_DESIGNER]),
  updateQuoteRequest
);

export default router;
