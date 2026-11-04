import { Router } from 'express';
import { getUsers, createUser, updateUser, updateMyProfile, changeMyPassword, deleteMyAccount } from './users.controller.js';
import { authenticate, requireRoles } from '../../middleware/auth.js';
import { UserRole } from '../../types/enums.js';

const router = Router();

// Admin-only routes
router.get('/', authenticate, requireRoles([UserRole.SUPER_ADMIN, UserRole.ADMIN]), getUsers);
router.post('/', authenticate, requireRoles([UserRole.SUPER_ADMIN, UserRole.ADMIN]), createUser);
router.patch('/:id', authenticate, requireRoles([UserRole.SUPER_ADMIN, UserRole.ADMIN]), updateUser);

// User self-management routes (authenticated users can manage their own profile)
router.patch('/me/profile', authenticate, updateMyProfile);
router.post('/me/change-password', authenticate, changeMyPassword);
router.delete('/me', authenticate, deleteMyAccount);

export default router;
