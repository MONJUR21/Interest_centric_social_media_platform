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
export const getPostsByUserId = (req, res) => {
  const userId = req.user.id;
  console.log(userId);
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
    console.log(rows);
    res.json(rows);
  });
};


// Create a new post
export const createPost = (req, res) => {
  console.log("Body:", req.body);
  console.log("File:", req.file);

  const { title, content, interest } = req.body; // Include `interest` from the form
  const userId = req.user.id; // Assuming `req.user` is set by authentication middleware
  console.log(userId);
  // Validate required fields
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }
  if (!interest) {
    return res.status(400).json({ error: "Interest is required" });
  }

  // Ensure the file is provided and fetch the file path
  const image = req.file ? req.file.path : null;
  if (!image) {
    return res.status(400).json({ error: "Image is required" });
  }

  // Query to insert the post into the database
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

    // Query to fetch the post along with the user's full_name
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
      console.log(postDetails[0]);
      res.status(201).json({
        message: "Post created successfully",
        post: postDetails[0],
      });
    });
  });
};

// Update an existing post
export const updatePost = (req, res) => {
  const { id } = req.params; // Post ID
  const { title, content, interest } = req.body; // Post details from request body
  const userId = req.user.id; // ID of the logged-in user
  const image = req.file ? req.file.path : null; // Uploaded image, if any

  // Query to fetch the current image and validate post ownership
  const fetchPostSql = 'SELECT image, user_id FROM posts WHERE id = ?';

  db.query(fetchPostSql, [id], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: 'Error fetching the post' }); // Handle query error
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' }); // Handle case where the post doesn't exist
    }

    const currentImage = rows[0].image; // Current image path
    const postOwnerId = rows[0].user_id; // Owner of the post

    // Validate if the user owns the post
    if (postOwnerId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to update this post' }); // Unauthorized access
    }

    // If a new image is uploaded, delete the old image
    if (image && currentImage && fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    // Update the post
    const updateSql = `
      UPDATE posts SET title = ?, content = ?, interest = ?, image = ?
      WHERE id = ?
    `;
    db.query(updateSql, [title, content, interest, image || currentImage, id], (updateError) => {
      if (updateError) {
        return res.status(500).json({ error: 'Error updating the post' });
      }

      // Fetch the updated post with user details
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
          return res.status(500).json({ error: 'Error fetching the updated post' });
        }

        if (updatedRows.length === 0) {
          return res.status(404).json({ error: 'Updated post not found' }); // Handle rare case
        }

        // Send the updated post back to the client
        res.json({ post: updatedRows[0] });
      });
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
