import db from "../config/db.js";

export const getAllCommentsForPost = (req, res) => {
  const { postId } = req.params;
  const query = "SELECT * FROM comments WHERE post_id = ?";

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
  const query = "SELECT * FROM comments WHERE id = ?";

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
  const { user_id, post_id, content } = req.body;
  const query =
    "INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)";

  db.query(query, [user_id, post_id, content], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: result.insertId });
    }
  });
};

export const updateComment = (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const query = "UPDATE comments SET content = ? WHERE id = ?";

  db.query(query, [content, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Comment updated successfully" });
    }
  });
};

export const deleteComment = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM comments WHERE id = ?";

  db.query(query, [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Comment deleted successfully" });
    }
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

