import db from '../config/db.js';
import fs from 'fs';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const JWT_SECRET_KEY = 'your_secret_key';  // Hardcoded secret key
const JWT_EXPIRATION = '1h';  // Hardcoded token expiration time
export const getAllUsers = (req, res) => {
  db.query('SELECT * FROM users', (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    console.log(rows);
    res.json(rows);
  })
}

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

export const createUser = async (req, res) => {
  try {
    const { username, email, password, full_name, bio } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const profile_picture = req.file ? req.file.path : null;

    const sql = `
      INSERT INTO users (username, email, password, full_name, bio, profile_picture)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      username,
      email,
      hashedPassword,
      full_name,
      bio,
      profile_picture
    ], (error, rows) => {
      if (error) {
        console.error('Database error:', error);
        // Delete the file if there's an error (to avoid orphaned files)
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ error: error.message });
      }
      res.status(201).json({ message: 'Registration successful!' });
    });

  } catch (error) {
    console.error('Error during registration:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path); // Delete the file from the server if registration fails
    }
    res.status(500).json({ message: 'Registration failed. Please try again.', error: error.message });
  }
};


export const login = (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Query to get user from DB
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    // Check if there's an error or no user found
    console.log(results);
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = results[0];

    // Compare the provided password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token if credentials match
    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION });

    // Send response with the token
    res.json({ token });
  });
};

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

export const deleteUser = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'User deleted successfully' });
  });
};
