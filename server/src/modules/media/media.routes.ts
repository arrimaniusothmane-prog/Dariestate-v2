import { Router } from 'express';
import { uploadMedia, getMediaFiles } from './media.controller.js';
import { upload } from '../../middleware/upload.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.post('/upload', upload.single('file'), uploadMedia);
router.get('/', getMediaFiles);

export default router;
