// interestRoutes.js
import express from 'express';
import {
  getAllInterests,
  getInterestById,
  createInterest,
  updateInterest,
  deleteInterest,
} from '../controllers/interestController.js';

const router = express.Router();

// Route to get all interests
router.get('/', getAllInterests);

// Route to get a specific interest by ID
router.get('/:id', getInterestById);

// Route to create a new interest
router.post('/', createInterest);

// Route to update an existing interest by ID
router.put('/:id', updateInterest);

// Route to delete an interest by ID
router.delete('/:id', deleteInterest);

export default router;
