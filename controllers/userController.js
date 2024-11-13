// controllers/userController.js
import db from '../config/db.js';

// Get all users
export const getAllUsers = (req, res) => {
  db.query('SELECT * FROM users', (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log(rows);
    res.json(rows);
  });
};

// Get user by ID
export const getUserById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users WHERE id = ?', [id], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  });
};

// Create a new user
export const createUser = (req, res) => {
  const { username, email, password, full_name, profile_picture, bio } = req.body;
  db.query(
    'INSERT INTO users (username, email, password, full_name, profile_picture, bio) VALUES (?, ?, ?, ?, ?, ?)',
    [username, email, password, full_name, profile_picture, bio],
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({ id: result.insertId });
    }
  );
};

// Update a user
export const updateUser = (req, res) => {
  const { id } = req.params;
  const { username, email, full_name, profile_picture, bio } = req.body;
  db.query(
    'UPDATE users SET username = ?, email = ?, full_name = ?, profile_picture = ?, bio = ? WHERE id = ?',
    [username, email, full_name, profile_picture, bio, id],
    (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: 'User updated successfully' });
    }
  );
};

// Delete a user
export const deleteUser = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'User deleted successfully' });
  });
};
