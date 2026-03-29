import express from 'express';
import { createAssessment, getAssessments } from '../controllers/assessmentController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { uploadAssessmentAttachment } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getAssessments);
router.post('/', protect, authorize('admin', 'instructor'), uploadAssessmentAttachment, createAssessment);

export default router;
