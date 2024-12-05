import db from "../config/db.js";
import { createNotification } from "./notificationController.js";
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

  // Check for existing reaction
  db.query(
    "SELECT * FROM reactions WHERE user_id = ? AND post_id = ?",
    [user_id, post_id],
    (error, existingReaction) => {
      if (error) {
        return res.status(500).json({ error: "Database query failed" });
      }

      // If the reaction already exists
      if (existingReaction.length > 0) {
        if (existingReaction[0].type === type) {
          // Remove the reaction if it's the same type
          db.query(
            "DELETE FROM reactions WHERE user_id = ? AND post_id = ?",
            [user_id, post_id],
            (deleteError) => {
              if (deleteError) {
                return res.status(500).json({ error: "Failed to remove reaction" });
              }
              return res.status(200).json({ message: "Reaction removed successfully" });
            }
          );
        } else {
          // Update the reaction if the type is different
          db.query(
            "DELETE FROM reactions WHERE user_id = ? AND post_id = ?",
            [user_id, post_id],
            (deleteError) => {
              if (deleteError) {
                return res.status(500).json({ error: "Failed to update reaction" });
              }

              // Insert the new reaction type
              db.query(
                "INSERT INTO reactions (user_id, post_id, type) VALUES (?, ?, ?)",
                [user_id, post_id, type],
                (insertError, result) => {
                  if (insertError) {
                    return res.status(500).json({ error: "Failed to add new reaction" });
                  }

                  // Notify post owner only if they are not the one reacting
                  db.query(
                    "SELECT user_id FROM posts WHERE id = ?",
                    [post_id],
                    (selectError, postData) => {
                      if (selectError) {
                        return res.status(500).json({ error: "Failed to fetch post owner" });
                      }

                      const postOwnerId = postData[0]?.user_id;
                      if (postOwnerId && postOwnerId !== user_id) {
                        createNotification(
                          postOwnerId,
                          "reaction",
                          post_id,
                          `User ${req.user.username} reacted to your post.`
                        );
                      }

                      return res.status(201).json({
                        id: result.insertId,
                        message: "Reaction updated successfully",
                        previousType: existingReaction[0].type,
                      });
                    }
                  );
                }
              );
            }
          );
        }
      } else {
        // Add a new reaction if none exists
        db.query(
          "INSERT INTO reactions (user_id, post_id, type) VALUES (?, ?, ?)",
          [user_id, post_id, type],
          (insertError, result) => {
            if (insertError) {
              return res.status(500).json({ error: "Failed to add reaction" });
            }

            // Notify post owner only if they are not the one reacting
            db.query(
              "SELECT user_id FROM posts WHERE id = ?",
              [post_id],
              (selectError, postData) => {
                if (selectError) {
                  return res.status(500).json({ error: "Failed to fetch post owner" });
                }

                const postOwnerId = postData[0]?.user_id;
                if (postOwnerId && postOwnerId !== user_id) {
                  createNotification(
                    postOwnerId,
                    "reaction",
                    post_id,
                    `User ${req.user.username} reacted to your post.`
                  );
                }

                return res.status(201).json({
                  id: result.insertId,
                  message: "Reaction added successfully",
                });
              }
            );
          }
        );
      }
    }
  );
};



