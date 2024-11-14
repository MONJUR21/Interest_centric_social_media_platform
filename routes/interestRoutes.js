import express from 'express';
import {
  getAllInterests,
  getInterestById,
  createInterest,
  updateInterest,
  deleteInterest,
} from '../controllers/interestController.js';

const router = express.Router();

router.get('/', getAllInterests);

router.get('/:id', getInterestById);

router.post('/', createInterest);

router.put('/:id', updateInterest);

router.delete('/:id', deleteInterest);

export default router;
