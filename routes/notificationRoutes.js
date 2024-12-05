import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  createNotification
} from '../controllers/notificationController.js';
import { verifyToken } from '../controllers/verify.js';
const router = express.Router();

// Route to fetch all notifications for a logged-in user
router.get('/', verifyToken, getUserNotifications);

// Route to mark a specific notification as read
router.put('/notifications/:notificationId/read',verifyToken, markNotificationAsRead);

export default router;
