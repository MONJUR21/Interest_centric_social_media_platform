import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import interestRoutes from './routes/interestRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import reactionRoutes from './routes/reactionRoutes.js';
import followRoutes from './routes/followRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userInterestRoutes from './routes/userInterestRoutes.js';
import postInterestRoutes from './routes/postInterestRoutes.js';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.json());
app.use('/postImages', express.static(path.join(__dirname, 'postImages')));

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the MySQL database');
  }
});

app.use('/api/users', userRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user-interests', userInterestRoutes);
app.use('/api/post-interests', postInterestRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

