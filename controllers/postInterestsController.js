import db from "../config/db.js";

// Get all interests associated with a specific post
export const getPostInterests = (req, res) => {
  const { postId } = req.params;
  db.query(
    "SELECT i.id, i.name FROM post_interests pi JOIN interests i ON pi.interest_id = i.id WHERE pi.post_id = ?",
    [postId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results);
    }
  );
};

// Add an interest to a specific post
export const addPostInterest = (req, res) => {
  const { postId } = req.params;
  const { interest_id } = req.body;
  db.query(
    "INSERT INTO post_interests (post_id, interest_id) VALUES (?, ?)",
    [postId, interest_id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({ message: "Interest added to post successfully" });
    }
  );
};

// Remove an interest from a specific post
export const removePostInterest = (req, res) => {
  const { postId, interestId } = req.params;
  db.query(
    "DELETE FROM post_interests WHERE post_id = ? AND interest_id = ?",
    [postId, interestId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: "Interest removed from post successfully" });
    }
  );
};
