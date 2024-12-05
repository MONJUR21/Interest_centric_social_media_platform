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
import { verifyToken } from '../controllers/verify.js';

const router = express.Router();

router.get('/post/:postId',verifyToken, getAllCommentsForPost);
router.get('/:id', getCommentById);
router.post('/',verifyToken, createComment);
router.put('/:id', verifyToken,updateComment);
router.delete('/:id',verifyToken, deleteComment);

router.get('/:id/replies', getRepliesForComment);
router.post('/:id/replies', addReplyToComment);
router.put('/replies/:replyId', updateReply);     
router.delete('/replies/:replyId', deleteReply);   
export default router;
