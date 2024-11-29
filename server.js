import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
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
import multer from 'multer'; // Import multer

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());

// Handle JSON body and URL-encoded data with larger limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files for uploaded images
app.use('/postImages', express.static(path.join(__dirname, 'postImages')));

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit for uploaded files
  },
}).single("image"); // Adjust "image" to match your form field name

// Route-specific middleware for handling `multipart/form-data`
// app.use("/api/posts", (req, res, next) => {
//   if (req.is("multipart/form-data")) {
//     upload(req, res, (err) => {
//       if (err) {
//         return res.status(400).json({ error: "File size exceeds limit of 5 MB" });
//       }
//       next();
//     });
//   } else {
//     next();
//   }
// });

// Routes

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
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});
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
