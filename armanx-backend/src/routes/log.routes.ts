import { Router } from 'express';
import { clearLogsHandler, getLogsHandler } from '../controllers/log.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', getLogsHandler);
router.delete('/', clearLogsHandler);

export default router;
