import db from "../config/db.js";
import fs from "fs";

export const getAllPosts = (req, res) => {
  const query = `
    SELECT 
      posts.id, 
      posts.title, 
      posts.content, 
      posts.image, 
      posts.created_at AS date,
      posts.interest, 
      users.full_name AS author,
      users.profile_picture
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC;
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error("Database query error:", error.message);
      return res
        .status(500)
        .json({ error: "Error fetching posts: " + error.message });
    }

    res.status(200).json(results);
  });
};

export const getPostsByUserId = (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT 
      posts.id, 
      posts.title, 
      posts.content, 
      posts.image, 
      posts.created_at,
      posts.interest, 
      users.full_name
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.user_id = ?
    ORDER BY posts.created_at DESC
  `;

  db.query(sql, [userId], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rows);
  });
};

export const createPost = (req, res) => {
  const { title, content, interest } = req.body;
  const userId = req.user.id;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }
  if (!interest) {
    return res.status(400).json({ error: "Interest is required" });
  }

  const image = req.file ? req.file.path : null;

  const insertPostQuery = `
    INSERT INTO posts (user_id, title, content, image, interest) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [userId, title, content, image, interest];

  db.query(insertPostQuery, values, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to create post" });
    }

    const fetchPostQuery = `
      SELECT 
        posts.id, 
        posts.title, 
        posts.content, 
        posts.image, 
        posts.interest, 
        posts.created_at, 
        users.full_name 
      FROM 
        posts 
      INNER JOIN 
        users 
      ON 
        posts.user_id = users.id 
      WHERE 
        posts.id = ?
    `;

    db.query(fetchPostQuery, [result.insertId], (err, postDetails) => {
      if (err) {
        console.error("Error fetching post details:", err);
        return res.status(500).json({ error: "Failed to fetch post details" });
      }
      res.status(201).json({
        message: "Post created successfully",
        post: postDetails[0],
      });
    });
  });
};

export const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, content, interest } = req.body;
  const userId = req.user.id;
  const image = req.file ? req.file.path : null;

  const fetchPostSql = "SELECT image, user_id FROM posts WHERE id = ?";

  db.query(fetchPostSql, [id], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: "Error fetching the post" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const currentImage = rows[0].image;
    const postOwnerId = rows[0].user_id;

    // Validate if the user owns the post
    if (postOwnerId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this post" });
    }

    if (image && currentImage && fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    const updateSql = `
      UPDATE posts SET title = ?, content = ?, interest = ?, image = ?
      WHERE id = ?
    `;
    db.query(
      updateSql,
      [title, content, interest, image || currentImage, id],
      (updateError) => {
        if (updateError) {
          return res.status(500).json({ error: "Error updating the post" });
        }

        const fetchUpdatedPostSql = `
        SELECT 
          posts.*, 
          users.full_name
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        WHERE posts.id = ?
      `;
        db.query(fetchUpdatedPostSql, [id], (fetchError, updatedRows) => {
          if (fetchError) {
            return res
              .status(500)
              .json({ error: "Error fetching the updated post" });
          }

          if (updatedRows.length === 0) {
            return res.status(404).json({ error: "Updated post not found" }); // Handle rare case
          }

          res.json({ post: updatedRows[0] });
        });
      }
    );
  });
};

export const deletePost = (req, res) => {
  const { id } = req.params;

  const fetchImageSql = "SELECT image FROM posts WHERE id = ?";

  db.query(fetchImageSql, [id], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const currentImage = rows[0].image;

    const sql = "DELETE FROM posts WHERE id = ?";

    db.query(sql, [id], (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (currentImage) {
        fs.unlinkSync(currentImage);
      }

      res.json({ message: "Post deleted successfully" });
    });
  });
};
export const getPostsByUserInterest = (req, res) => {

  const userId = req.user.id;

  const sql = `
    SELECT COUNT(*) AS posts_count
    FROM posts
    WHERE user_id = ?;
  `;

  db.query(sql, [userId], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rows);
  });
};

export const getPostCountByInterest = (req, res) => {
  const userId = req.user.id;

  const query = `
      SELECT interest, COUNT(*) AS post_count
      FROM posts
      WHERE user_id = ?
      GROUP BY interest;
    `;
  db.query(query, [userId], (err, rows) => {
    if (err) console.error(err);
    res.json(rows);
  });
};
