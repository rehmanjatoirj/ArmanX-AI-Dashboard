import { Router } from 'express';
import authRoutes from './auth.routes';
import agentRoutes from './agent.routes';
import leadRoutes from './lead.routes';
import sequenceRoutes from './sequence.routes';
import metricsRoutes from './metrics.routes';
import logRoutes from './log.routes';
import { sendSuccess } from '../utils/response.utils';

const router = Router();

router.get('/health', (_req, res) =>
  sendSuccess(res, {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }),
);

router.use('/auth', authRoutes);
router.use('/agents', agentRoutes);
router.use('/leads', leadRoutes);
router.use('/sequences', sequenceRoutes);
router.use('/metrics', metricsRoutes);
router.use('/logs', logRoutes);

export default router;
