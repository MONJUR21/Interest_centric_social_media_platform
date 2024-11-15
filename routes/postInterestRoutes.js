import express from 'express';
import { getPostInterests, addPostInterest, removePostInterest } from '../controllers/postInterestsController.js';

const router = express.Router();

router.get('/:postId', getPostInterests);
router.post('/:postId', addPostInterest);
router.delete('/:postId/:interestId', removePostInterest);

export default router;
