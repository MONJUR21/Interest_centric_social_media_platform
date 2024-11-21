import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByUserInterest,
} from '../controllers/postController.js';

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'postImages/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// Routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', upload.single('image'), createPost); // Upload image with post
router.put('/:id', upload.single('image'), updatePost); // Allow image updates
router.delete('/:id', deletePost);
router.get('/interests/:userId', getPostsByUserInterest);

export default router;
