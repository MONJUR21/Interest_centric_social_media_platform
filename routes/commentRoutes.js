import express from 'express';
import {
  getAllCommentsForPost,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  getRepliesForComment,
  addReplyToComment
} from '../controllers/commentController.js';

const router = express.Router();

router.get('/post/:postId', getAllCommentsForPost);
router.get('/:id', getCommentById);
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

router.get('/:id/replies', getRepliesForComment);
router.post('/:id/replies', addReplyToComment);

export default router;
