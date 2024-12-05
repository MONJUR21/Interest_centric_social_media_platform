import db from "../config/db.js";
import { createNotification } from "./notificationController.js";
// Get all users except the logged-in user
export const getUsers = (req, res) => {
  const userId = req.user.id; // Extract user ID from middleware-decoded token

  const query = "SELECT id, username, full_name FROM users WHERE id != ?";

  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(rows); // Return the list of users
  });
};

// Get followers of a specific user
export const getFollowers = (req, res) => {
  const userId = req.user.id; // Extract user ID from request parameters

  const query = `
    SELECT users.id, users.username, users.full_name
    FROM follows
    JOIN users ON follows.follower_id = users.id
    WHERE follows.followed_id = ?
  `;

  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching followers:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(rows); // Return the list of followers
  });
};

// Get users followed by a specific user
export const getFollowing = (req, res) => {
  const userId = req.user.id; // Extract user ID from request parameters

  const query = `
    SELECT users.id, users.username, users.full_name
    FROM follows
    JOIN users ON follows.followed_id = users.id
    WHERE follows.follower_id = ?
  `;

  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching following list:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(rows); // Return the list of followed users
  });
};

// Follow a user
export const followUser = (req, res) => {
  const { followUserId } = req.body; // ID of the user to follow
  const followerId = req.user.id; // Logged-in user's ID

  const checkQuery =
    "SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?";

  db.query(checkQuery, [followerId, followUserId], (err, rows) => {
    if (err) {
      console.error("Error checking follow status:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (rows.length > 0) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Insert the new follow relationship
    const insertQuery =
      "INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)";

    db.query(insertQuery, [followerId, followUserId], (err) => {
      if (err) {
        console.error("Error following user:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      createNotification(followUserId, 'follow', followerId, 'You have a new follower.');
      res.status(200).json({ message: "User followed successfully", followUserId });
    });
  });
};

// Unfollow a user
export const unfollowUser = (req, res) => {
  const { userId } = req.body; // ID of the user to unfollow
  const followerId = req.user.id; // Logged-in user's ID

  const query = "DELETE FROM follows WHERE follower_id = ? AND followed_id = ?";

  db.query(query, [followerId, userId], (err) => {
    if (err) {
      console.error("Error unfollowing user:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    res.status(200).json({ message: "User unfollowed successfully", userId });
  });
};









export const getFollowCounts = (req, res) => {
  const userId = req.user.id; // Logged-in user ID

  const followersQuery = `
    SELECT COUNT(*) AS followersCount 
    FROM follows 
    WHERE followed_id = ?
  `;

  const followingQuery = `
    SELECT COUNT(*) AS followingCount 
    FROM follows 
    WHERE follower_id = ?
  `;

  // Execute both queries
  db.query(followersQuery, [userId], (err, followersResult) => {
    if (err) {
      console.error("Error fetching followers count:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    db.query(followingQuery, [userId], (err, followingResult) => {
      if (err) {
        console.error("Error fetching following count:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      // Return both counts
      res.status(200).json({
        followersCount: followersResult[0].followersCount,
        followingCount: followingResult[0].followingCount,
      });
    });
  });
};

