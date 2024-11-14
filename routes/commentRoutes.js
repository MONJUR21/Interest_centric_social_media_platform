import express from 'express';
import {
  getAllCommentsForPost,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  getRepliesForComment,
  addReplyToComment,
  updateReply,
  deleteReply
} from '../controllers/commentController.js';

const router = express.Router();

router.get('/post/:postId', getAllCommentsForPost);
router.get('/:id', getCommentById);
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

router.get('/:id/replies', getRepliesForComment);
router.post('/:id/replies', addReplyToComment);
router.put('/replies/:replyId', updateReply);     
router.delete('/replies/:replyId', deleteReply);   
export default router;
