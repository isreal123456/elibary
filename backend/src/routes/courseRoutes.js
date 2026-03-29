import express from 'express';
import {
  addModuleToCourse,
  createCourse,
  getCourseById,
  getCourses,
  updateCourse,
  updateModuleInCourse,
} from '../controllers/courseController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { uploadModulePdf } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('admin', 'instructor'), createCourse);
router.patch('/:id', protect, authorize('admin', 'instructor'), updateCourse);
router.post('/:id/modules', protect, authorize('admin', 'instructor'), uploadModulePdf, addModuleToCourse);
router.patch(
  '/:id/modules/:moduleId',
  protect,
  authorize('admin', 'instructor'),
  uploadModulePdf,
  updateModuleInCourse,
);

export default router;
