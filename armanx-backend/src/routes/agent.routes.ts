import { Router } from 'express';
import {
  createAgentHandler,
  deleteAgentHandler,
  getAgent,
  getAgents,
  pauseAgentHandler,
  restartAgentHandler,
  startAgentHandler,
  updateAgentHandler,
} from '../controllers/agent.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createAgentSchema, updateAgentSchema } from '../schemas/agent.schema';

const router = Router();

router.use(authenticate);
router.get('/', getAgents);
router.post('/', validate(createAgentSchema), createAgentHandler);
router.get('/:id', getAgent);
router.put('/:id', validate(updateAgentSchema), updateAgentHandler);
router.delete('/:id', deleteAgentHandler);
router.post('/:id/start', startAgentHandler);
router.post('/:id/pause', pauseAgentHandler);
router.post('/:id/restart', restartAgentHandler);

export default router;
