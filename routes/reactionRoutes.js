// routes/reactionRoutes.js
import express from 'express';
import {
  getReactionsForPost,
  addReaction,
  deleteReaction
} from '../controllers/reactionController.js';

const router = express.Router();

// Routes for reactions on a post
router.get('/post/:postId', getReactionsForPost);
router.post('/', addReaction);
router.delete('/:id', deleteReaction);

export default router;
