import express from 'express';
import {
  getAllFAQs,
  getAllFAQsAdmin,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from '../controllers/faqController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route to get active FAQs
router.get('/', getAllFAQs);

// Admin routes
router.get('/admin', auth, authorize('admin', 'employee'), getAllFAQsAdmin);
router.post('/', auth, authorize('admin', 'employee'), createFAQ);
router.put('/:id', auth, authorize('admin', 'employee'), updateFAQ);
router.delete('/:id', auth, authorize('admin', 'employee'), deleteFAQ);

export default router;
