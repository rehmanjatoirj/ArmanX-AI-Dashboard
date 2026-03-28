import { Router } from 'express';
import {
  createSequence,
  deleteSequence,
  getSequence,
  getSequences,
  updateSequence,
} from '../controllers/sequence.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createSequenceSchema, updateSequenceSchema } from '../schemas/sequence.schema';

const router = Router();

router.use(authenticate);
router.get('/', getSequences);
router.post('/', validate(createSequenceSchema), createSequence);
router.get('/:id', getSequence);
router.put('/:id', validate(updateSequenceSchema), updateSequence);
router.delete('/:id', deleteSequence);

export default router;
