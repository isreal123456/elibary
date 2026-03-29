import express from 'express';
import {
  createOrUpdateSubmission,
  getVisibleSubmissions,
} from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSubmissionFile } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getVisibleSubmissions);
router.post('/:id', protect, uploadSubmissionFile, createOrUpdateSubmission);

export default router;
