import { Router } from 'express';
import { dashboardMetrics, funnelMetrics, topSequences } from '../controllers/metrics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/dashboard', dashboardMetrics);
router.get('/funnel', funnelMetrics);
router.get('/sequences/top', topSequences);

export default router;
