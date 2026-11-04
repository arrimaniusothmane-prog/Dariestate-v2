import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite, checkFavorite } from './favorites.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// All favorites routes require authentication
router.get('/', authenticate, getFavorites);
router.post('/', authenticate, addFavorite);
router.delete('/:propertyId', authenticate, removeFavorite);
router.get('/check/:propertyId', authenticate, checkFavorite);

export default router;
