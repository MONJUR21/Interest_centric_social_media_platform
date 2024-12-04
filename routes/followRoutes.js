import express from 'express';
import {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser
} from '../controllers/followController.js';
import { verifyToken } from '../controllers/verify.js';
const router = express.Router();

router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);
router.post('/',verifyToken, followUser);
router.delete('/', unfollowUser);

export default router;
