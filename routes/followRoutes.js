import express from "express";
import {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  getUsers,
  getFollowCounts
} from "../controllers/followController.js";
import { verifyToken } from "../controllers/verify.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.get("/followers", verifyToken, getFollowers);
router.get("/following", verifyToken, getFollowing);
router.post("/", verifyToken, followUser);
router.post("/unfollow", verifyToken, unfollowUser);
router.get("/counts", verifyToken, getFollowCounts);

export default router;
