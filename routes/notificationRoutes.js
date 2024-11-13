// routes/notificationRoutes.js
import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  createNotification
} from '../controllers/notificationController.js';

const router = express.Router();

// Routes to handle notifications
router.get('/:userId', getUserNotifications);  // Get notifications for a specific user
router.patch('/:notificationId', markNotificationAsRead); // Mark a notification as read

export default router;
