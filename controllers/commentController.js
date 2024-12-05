import db from "../config/db.js";

export const getAllCommentsForPost = (req, res) => {
  const { postId } = req.params;
  const query = `
    SELECT c.id, c.content, c.created_at, u.full_name 
    FROM comments c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.post_id = ? 
    ORDER BY c.created_at DESC
  `;

  db.query(query, [postId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
};

export const getCommentById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT c.id, c.content, c.created_at, u.full_name 
    FROM comments c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.id = ?
  `;

  db.query(query, [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (rows.length === 0) {
      res.status(404).json({ error: "Comment not found" });
    } else {
      res.json(rows[0]);
    }
  });
};

export const createComment = (req, res) => {
  const { post_id, content } = req.body;
  const user_id = req.user.id;

  if (!user_id || !post_id || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const insertQuery = 'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)';
  db.query(insertQuery, [user_id, post_id, content], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding comment' });
    }

    const fetchCommentsQuery = `
      SELECT c.id, c.content, c.created_at, u.full_name 
      FROM comments c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.post_id = ? 
      ORDER BY c.created_at DESC
    `;
    db.query(fetchCommentsQuery, [post_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching comments' });
      }
      res.status(201).json({ comments: results }); // Return all comments
    });
  });
};

export const updateComment = (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id; // Assume the user's ID is available in req.user from JWT middleware.

  const checkOwnershipQuery = "SELECT user_id FROM comments WHERE id = ?";
  const updateQuery = "UPDATE comments SET content = ? WHERE id = ?";

  db.query(checkOwnershipQuery, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (results[0].user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this comment" });
    }

    db.query(updateQuery, [content, id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Comment updated successfully", updatedContent: content });
      }
    });
  });
};

export const deleteComment = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Assume the user's ID is available in req.user from JWT middleware.

  const checkOwnershipQuery = "SELECT user_id FROM comments WHERE id = ?";
  const deleteQuery = "DELETE FROM comments WHERE id = ?";

  db.query(checkOwnershipQuery, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (results[0].user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this comment" });
    }

    db.query(deleteQuery, [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Comment deleted successfully", deletedCommentId: id });
      }
    });
  });
};


export const getRepliesForComment = (req, res) => {
  const { id } = req.params; // Comment ID
  const query = "SELECT * FROM comment_replies WHERE comment_id = ?";

  db.query(query, [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
};

export const addReplyToComment = (req, res) => {
  const { id } = req.params;
  const { user_id, content } = req.body;
  const query =
    "INSERT INTO comment_replies (comment_id, user_id, content) VALUES (?, ?, ?)";

  db.query(query, [id, user_id, content], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: result.insertId });
    }
  });
};

export const updateReply = (req, res) => {
  const { replyId } = req.params;
  const { content } = req.body;
  const query = "UPDATE comment_replies SET content = ? WHERE id = ?";

  db.query(query, [content, replyId], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Reply updated successfully" });
    }
  });
};

export const deleteReply = (req, res) => {
  const { replyId } = req.params;
  const query = "DELETE FROM comment_replies WHERE id = ?";

  db.query(query, [replyId], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Reply deleted successfully" });
    }
  });
};
