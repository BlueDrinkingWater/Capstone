import express from 'express';
import {
  getAllPromotions,
  getAllPromotionsAdmin,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from '../controllers/promotionsController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/', getAllPromotions);

// Admin routes
router.get('/admin', auth, authorize('admin'), getAllPromotionsAdmin);
router.post('/', auth, authorize('admin'), createPromotion);
router.put('/:id', auth, authorize('admin'), updatePromotion);
router.delete('/:id', auth, authorize('admin'), deletePromotion);

export default router;