import db from "../config/db.js";

// Get all interests for a specific user
export const getUserInterests = (req, res) => {
  const { userId } = req.params;
  db.query(
    "SELECT i.id, i.name FROM user_interests ui JOIN interests i ON ui.interest_id = i.id WHERE ui.user_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results);
    }
  );
};

// Add a new interest for a specific user
export const addUserInterest = (req, res) => {
  const { userId } = req.params;
  const { interest_id } = req.body;
  db.query(
    "INSERT INTO user_interests (user_id, interest_id) VALUES (?, ?)",
    [userId, interest_id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({ message: "Interest added successfully" });
    }
  );
};

// Remove an interest from a specific user
export const removeUserInterest = (req, res) => {
  const { userId, interestId } = req.params;
  db.query(
    "DELETE FROM user_interests WHERE user_id = ? AND interest_id = ?",
    [userId, interestId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: "Interest removed successfully" });
    }
  );
};
