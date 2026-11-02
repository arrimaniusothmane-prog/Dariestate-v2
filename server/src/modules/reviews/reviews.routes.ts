import { Router } from 'express';
import { getReviews, getAdminStats } from './reviews.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/', getReviews);
router.get('/stats', authenticate, getAdminStats);

export default router;
