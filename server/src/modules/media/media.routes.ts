import { Router } from 'express';
import { uploadMedia, uploadMediaMultiple, getMediaFiles } from './media.controller.js';
import { upload } from '../../middleware/upload.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.post('/upload', upload.single('file'), uploadMedia);
router.post('/upload-multiple', upload.array('files', 20), uploadMediaMultiple);
router.get('/', getMediaFiles);

export default router;
