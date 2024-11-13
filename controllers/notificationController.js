// controllers/notificationController.js
import db from '../config/db.js';

// Get all notifications for a specific user
export const getUserNotifications = (req, res) => {
  const { userId } = req.params;
  db.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (error, notifications) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(notifications);
    }
  );
};

// Mark a notification as read
export const markNotificationAsRead = (req, res) => {
  const { notificationId } = req.params;
  db.query(
    'UPDATE notifications SET is_read = TRUE WHERE id = ?',
    [notificationId],
    (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json({ message: 'Notification marked as read' });
    }
  );
};

// Create a new notification
export const createNotification = (userId, type, referenceId, content) => {
  db.query(
    'INSERT INTO notifications (user_id, type, reference_id, content) VALUES (?, ?, ?, ?)',
    [userId, type, referenceId, content],
    (error) => {
      if (error) {
        console.error('Error creating notification:', error.message);
      }
    }
  );
};
