import express from 'express';
import { getUserById, getUsers, updateUserRole } from '../controllers/userController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, getUserById);
router.patch('/:id/role', protect, authorize('admin'), updateUserRole);

export default router;
