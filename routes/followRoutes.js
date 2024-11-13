// routes/followRoutes.js
import express from 'express';
import {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser
} from '../controllers/followController.js';

const router = express.Router();

// Routes to handle follows
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);
router.post('/', followUser);
router.delete('/', unfollowUser);

export default router;