import express from 'express';
import {
  changePassword,
  getCurrentUser,
  loginUser,
  registerUser,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.patch('/change-password', protect, changePassword);

export default router;
