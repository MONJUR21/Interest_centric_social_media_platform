import db from "../config/db.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const JWT_SECRET_KEY = "your_secret_key";
const JWT_EXPIRATION = "1h";
export const getAllUsers = (req, res) => {
  db.query("SELECT * FROM users", (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(rows);
  });
};

export const getUserById = (req, res) => {
  const userId = req.user.id;
  db.query("SELECT * FROM users WHERE id = ?", [userId], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  });
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password, full_name, bio } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const profile_picture = req.file ? req.file.path : null;

    const sql = `
      INSERT INTO users (username, email, password, full_name, bio, profile_picture)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [username, email, hashedPassword, full_name, bio, profile_picture],
      (error, rows) => {
        if (error) {
          console.error("Database error:", error);
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ message: "Registration successful!" });
      }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res
      .status(500)
      .json({
        message: "Registration failed. Please try again.",
        error: error.message,
      });
  }
};

export const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      // Check if there's an er
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id,username: user.full_name }, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRATION,
      });

      res.json({ token });
    }
  );
};

export const updateUser = (req, res) => {
  const { username, email, full_name, bio } = req.body;
  const userId = req.user.id;
  const image = req.file ? req.file.path : null;

  db.query(
    "SELECT profile_picture FROM users WHERE id = ?",
    [userId],
    (selectError, results) => {
      if (selectError) {
        return res.status(500).json({ error: selectError.message });
      }

      const currentProfilePicture = results[0]?.profile_picture;

      // Update query
      const query = `
      UPDATE users 
      SET username = ?, email = ?, full_name = ?, bio = ?, profile_picture = ? 
      WHERE id = ?
    `;

      const values = [
        username,
        email,
        full_name,
        bio,
        image || currentProfilePicture,
        userId,
      ];

      db.query(query, values, (updateError) => {
        if (updateError) {
          return res.status(500).json({ error: updateError.message });
        }

        if (req.file && currentProfilePicture) {
          fs.unlink(currentProfilePicture, (unlinkError) => {
            if (unlinkError) {
              console.error(
                "Error deleting old profile picture:",
                unlinkError.message
              );
            }
          });
        }

        const fetchUpdatedUserSql = `
        SELECT id, username, email, full_name, bio, profile_picture
        FROM users
        WHERE id = ?
      `;

        db.query(fetchUpdatedUserSql, [userId], (fetchError, updatedRows) => {
          if (fetchError) {
            return res
              .status(500)
              .json({ error: "Error fetching updated user data" });
          }

          if (updatedRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
          }

          res.json({
            message: "User updated successfully",
            user: updatedRows[0],
          });
        });
      });
    }
  );
};

export const deleteUser = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: "User deleted successfully" });
  });
};
