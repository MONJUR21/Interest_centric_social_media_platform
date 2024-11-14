import db from '../config/db.js';

export const getReactionsForPost = (req, res) => {
  const { postId } = req.params;
  db.query('SELECT * FROM reactions WHERE post_id = ?', [postId], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rows);
  });
};

export const addReaction = (req, res) => {
  const { user_id, post_id, type } = req.body;
  
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

export const deleteReaction = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM reactions WHERE id = ?', [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Reaction deleted successfully' });
  });
};
