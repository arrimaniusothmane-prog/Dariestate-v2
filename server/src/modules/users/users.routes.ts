import { Router } from 'express';
import { getUsers, createUser, updateUser } from './users.controller.js';
import { authenticate, requireRoles } from '../../middleware/auth.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(requireRoles([UserRole.SUPER_ADMIN, UserRole.ADMIN]));

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);

export default router;
