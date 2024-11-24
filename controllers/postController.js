import db from '../config/db.js';
import fs from 'fs';

// Get all posts
export const getAllPosts = (req, res) => {
  const sql = `
    SELECT posts.id, posts.title, posts.content, posts.image, users.full_name
    FROM posts
    JOIN users ON posts.user_id = users.id
  `;

  db.query(sql, (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rows);
  });
};

// Get a single post by ID
export const getPostById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT posts.id, posts.title, posts.content, posts.image, users.full_name
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.id = ?
  `;

  db.query(sql, [id], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(rows[0]);
  });
};

// Create a new post
export const createPost = (req, res) => {
  console.log("Body:", req.body); // Logs text fields
  console.log("File:", req.file); // Logs file details
  const { title, content } = req.body;
  console.log(title);
  const userId = req.user.id;
  console.log(userId);
  if (!title) {
    return res.status(400).json({ error: "title required" });
  }
  if (!content) {
    return res.status(400).json({ error: "content required" });
  }

  const image = req.file.path;

  // Query to insert the post into the database
  const insertPostQuery =
    "INSERT INTO posts (user_id, title, content,image) VALUES (?, ?, ?,?)";
  const values = [userId, title, content,image];

  db.query(insertPostQuery, values, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to create post" });
    }

    // Query to fetch the post along with the user's full_name
    const fetchPostQuery = `
      SELECT 
        posts.id, 
        posts.title, 
        posts.content, 
        posts.image, 
        posts.created_at, 
        users.full_name 
      FROM 
        posts 
      INNER JOIN 
        users 
      ON 
        posts.user_id = users.id 
      WHERE 
        posts.id = ?`;

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
// Update an existing post
export const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const image = req.file ? req.file.path : null;

  // Query to fetch the current image
  const fetchImageSql = 'SELECT image FROM posts WHERE id = ?';

  db.query(fetchImageSql, [id], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const currentImage = rows[0].image;

    // Update query
    const sql = `
      UPDATE posts SET title = ?, content = ?, image = ?
      WHERE id = ?
    `;

    db.query(sql, [title, content, image || currentImage, id], (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Delete old image if a new one is uploaded
      if (image && currentImage) {
        fs.unlinkSync(currentImage);
      }

      res.json({ message: 'Post updated successfully' });
    });
  });
};

// Delete a post
export const deletePost = (req, res) => {
  const { id } = req.params;

  // Query to fetch the current image
  const fetchImageSql = 'SELECT image FROM posts WHERE id = ?';

  db.query(fetchImageSql, [id], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const currentImage = rows[0].image;

    // Delete the post
    const sql = 'DELETE FROM posts WHERE id = ?';

    db.query(sql, [id], (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Delete the image file if it exists
      if (currentImage) {
        fs.unlinkSync(currentImage);
      }

      res.json({ message: 'Post deleted successfully' });
    });
  });
};

// Get posts by user interest
export const getPostsByUserInterest = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT p.id, p.title, p.content, p.image, u.full_name
    FROM posts p
    JOIN post_interests pi ON p.id = pi.post_id
    JOIN user_interests ui ON pi.interest_id = ui.interest_id
    JOIN users u ON p.user_id = u.id
    WHERE ui.user_id = ?
  `;

  db.query(sql, [userId], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rows);
  });
};
