import { Router } from 'express';
import {
  bulkCreateLeadsHandler,
  createLeadHandler,
  deleteLeadHandler,
  exportLeadsCsvHandler,
  getLead,
  getLeads,
  updateLeadHandler,
} from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { bulkLeadSchema, createLeadSchema, leadQuerySchema, updateLeadSchema } from '../schemas/lead.schema';

const router = Router();

router.use(authenticate);
router.get('/', validate(leadQuerySchema), getLeads);
router.post('/', validate(createLeadSchema), createLeadHandler);
router.post('/bulk', validate(bulkLeadSchema), bulkCreateLeadsHandler);
router.get('/export/csv', exportLeadsCsvHandler);
router.get('/:id', getLead);
router.put('/:id', validate(updateLeadSchema), updateLeadHandler);
router.delete('/:id', deleteLeadHandler);

export default router;
