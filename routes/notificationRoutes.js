import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  createNotification
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/:userId', getUserNotifications); 
router.patch('/:notificationId', markNotificationAsRead);

export default router;
