// controllers/reactionController.js
import db from '../config/db.js';

// Get all reactions for a specific post
export const getReactionsForPost = (req, res) => {
  const { postId } = req.params;
  db.query('SELECT * FROM reactions WHERE post_id = ?', [postId], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rows);
  });
};

// Add a reaction to a post
export const addReaction = (req, res) => {
  const { user_id, post_id, type } = req.body;
  
  // Check if the user has already reacted to the post
  db.query(
    'SELECT * FROM reactions WHERE user_id = ? AND post_id = ?',
    [user_id, post_id],
    (error, existingReaction) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (existingReaction.length > 0) {
        return res.status(400).json({ error: 'User has already reacted to this post' });
      }

      // Add the reaction if the user hasn't reacted yet
      db.query(
        'INSERT INTO reactions (user_id, post_id, type) VALUES (?, ?, ?)',
        [user_id, post_id, type],
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }
          res.status(201).json({ id: result.insertId });
        }
      );
    }
  );
};

// Delete a reaction by its ID
export const deleteReaction = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM reactions WHERE id = ?', [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Reaction deleted successfully' });
  });
};
