// routes/reactionRoutes.js
import express from 'express';
import {
  getReactionsForPost,
  addReaction,
} from '../controllers/reactionController.js';
import { verifyToken } from '../controllers/verify.js';

const router = express.Router();

router.get('/post/:postId',verifyToken, getReactionsForPost);
router.post('/',verifyToken, addReaction);

export default router;
