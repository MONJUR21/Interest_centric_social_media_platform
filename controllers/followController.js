import db from '../config/db.js';
import { createNotification } from './notificationController.js';

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

export const followUser = async (req, res) => {
  const { userId } = req.body; 
  const followerId = req.user.id; 

  try {
    // Check if the follow record already exists
    const [rows] = await db.promise().query(
      'SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?',
      [followerId, userId]
    );

    if (rows.length > 0) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add the follow relationship to the database
    await db.promise().query(
      'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)',
      [followerId, userId]
    );

    return res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


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
