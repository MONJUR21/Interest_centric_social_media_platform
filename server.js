// app.js
import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import interestRoutes from './routes/interestRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import reactionRoutes from './routes/reactionRoutes.js';
import followRoutes from './routes/followRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'; // Import the notification routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the MySQL database');
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/notifications', notificationRoutes); // Add the notification routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
