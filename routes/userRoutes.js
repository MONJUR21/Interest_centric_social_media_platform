import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser,login } from '../controllers/userController.js';
import multer from 'multer'
import path from 'path'

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a unique filename
  },
});
const upload = multer({ storage });
const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', upload.single('profile_picture'), createUser);
router.post('/login',login)
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;