import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../controllers/verify.js';
import {
  getAllPosts,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost,
  getPostsByUserInterest,
  getPostCountByInterest
} from '../controllers/postController.js';

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'postImages/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.get('/', getAllPosts);
router.get('/user',verifyToken, getPostsByUserId);
router.post('/',verifyToken,upload.single('image'),createPost);
router.put('/:id',verifyToken, upload.single('image'), updatePost); 
router.delete('/:id', deletePost);
router.get('/interests/:userId', getPostsByUserInterest);
router.get('/interests',verifyToken, getPostCountByInterest);



export default router;
