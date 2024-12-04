import db from "../config/db.js";

export const getReactionsForPost = (req, res) => {
  const { postId } = req.params;
  db.query(
    "SELECT * FROM reactions WHERE post_id = ?",
    [postId],
    (error, rows) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(rows);
    }
  );
};

export const addReaction = (req, res) => {
  const { post_id, type } = req.body;
  const user_id = req.user.id;

  db.query(
    "SELECT * FROM reactions WHERE user_id = ? AND post_id = ?",
    [user_id, post_id],
    (error, existingReaction) => {
      if (error) {
        return res.status(500).json({ error: "Database query failed" });
      }

      if (existingReaction.length > 0) {
        if (existingReaction[0].type === type) {
          db.query(
            "DELETE FROM reactions WHERE user_id = ? AND post_id = ?",
            [user_id, post_id],
            (deleteError) => {
              if (deleteError) {
                return res
                  .status(500)
                  .json({ error: "Failed to remove reaction" });
              }
              return res
                .status(200)
                .json({ message: "Reaction removed successfully" });
            }
          );
        } else {
          db.query(
            "DELETE FROM reactions WHERE user_id = ? AND post_id = ?",
            [user_id, post_id],
            (deleteError) => {
              if (deleteError) {
                return res
                  .status(500)
                  .json({ error: "Failed to update reaction" });
              }

              db.query(
                "INSERT INTO reactions (user_id, post_id, type) VALUES (?, ?, ?)",
                [user_id, post_id, type],
                (insertError, result) => {
                  if (insertError) {
                    return res
                      .status(500)
                      .json({ error: "Failed to add new reaction" });
                  }
                  return res.status(201).json({
                    id: result.insertId,
                    message: "Reaction updated successfully",
                    previousType: existingReaction[0].type, // Include previousType
                  });
                }
              );
            }
          );
        }
      } else {
        db.query(
          "INSERT INTO reactions (user_id, post_id, type) VALUES (?, ?, ?)",
          [user_id, post_id, type],
          (insertError, result) => {
            if (insertError) {
              return res.status(500).json({ error: "Failed to add reaction" });
            }
            return res
              .status(201)
              .json({
                id: result.insertId,
                message: "Reaction added successfully",
              });
          }
        );
      }
    }
  );
};


