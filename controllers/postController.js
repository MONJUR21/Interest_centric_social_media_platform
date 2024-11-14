import db from '../config/db.js';

export const getAllPosts = (req, res) => {
  db.query('SELECT * FROM posts', (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rows);
  });
};

export const getPostById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM posts WHERE id = ?', [id], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(rows[0]);
  });
};

export const createPost = (req, res) => {
  const { user_id, title, content, image } = req.body;
  db.query(
    'INSERT INTO posts (user_id, title, content, image) VALUES (?, ?, ?, ?)',
    [user_id, title, content, image],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({ id: result.insertId });
    }
  );
};

export const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, content, image } = req.body;
  db.query(
    'UPDATE posts SET title = ?, content = ?, image = ? WHERE id = ?',
    [title, content, image, id],
    (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: 'Post updated successfully' });
    }
  );
};

export const deletePost = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM posts WHERE id = ?', [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Post deleted successfully' });
  });
};

export const getPostsByUserInterest = (req, res) => {
  const { userId } = req.params;
  db.query(
    `SELECT p.* FROM posts p
     JOIN post_interests pi ON p.id = pi.post_id
     JOIN user_interests ui ON pi.interest_id = ui.interest_id
     WHERE ui.user_id = ?`,
    [userId],
    (error, rows) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(rows);
    }
  );
};
