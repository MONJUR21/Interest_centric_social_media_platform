// routes/postRoutes.js
import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByUserInterest
} from '../controllers/postController.js';

const router = express.Router();

// CRUD operations for posts
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// Additional route to get posts by user's interests
router.get('/interests/:userId', getPostsByUserInterest);

export default router;
