import express from 'express';
import { getUserInterests, addUserInterest, removeUserInterest } from '../controllers/userInterestsController.js';

const router = express.Router();

router.get('/:userId', getUserInterests);
router.post('/:userId', addUserInterest);
router.delete('/:userId/:interestId', removeUserInterest);

export default router;
