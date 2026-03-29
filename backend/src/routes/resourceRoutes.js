import express from 'express';
import { createResource, getResources } from '../controllers/resourceController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getResources);
router.post('/', protect, authorize('admin'), createResource);

export default router;
