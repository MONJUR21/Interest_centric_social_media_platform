// controllers/followController.js
import db from '../config/db.js';
import { createNotification } from './notificationController.js';

// Get a list of followers for a specific user
export const getFollowers = (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT users.id, users.username
    FROM follows
    JOIN users ON follows.follower_id = users.id
    WHERE follows.followed_id = ?
  `;

  db.query(query, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
};

// Get a list of users that a specific user is following
export const getFollowing = (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT users.id, users.username
    FROM follows
    JOIN users ON follows.followed_id = users.id
    WHERE follows.follower_id = ?
  `;

  db.query(query, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
};

// Follow a user
export const followUser = (req, res) => {
  const { follower_id, followed_id } = req.body;
  const checkFollowQuery = 'SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?';
  const insertFollowQuery = 'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)';
  
  if (follower_id === followed_id) {
    return res.status(400).json({ error: "You can't follow yourself" });
  }

  db.query(checkFollowQuery, [follower_id, followed_id], (err, existingFollow) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (existingFollow.length > 0) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    db.query(insertFollowQuery, [follower_id, followed_id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Create a follow notification for the followed user
      createNotification(followed_id, 'follow', follower_id, `User ${follower_id} started following you`);

      res.status(201).json({ message: 'User followed successfully' });
    });
  });
};

// Unfollow a user
export const unfollowUser = (req, res) => {
  const { follower_id, followed_id } = req.body;
  const query = 'DELETE FROM follows WHERE follower_id = ? AND followed_id = ?';

  db.query(query, [follower_id, followed_id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: 'User unfollowed successfully' });
  });
};
