import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser,login } from '../controllers/userController.js';
import multer from 'multer'
import path from 'path'
import { verifyToken } from '../controllers/verify.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
const router = express.Router();

router.get('/', getAllUsers);
router.get('/user',verifyToken, getUserById);
router.post('/', upload.single('profile_picture'), createUser);
router.post('/login',login)
router.put('/update',verifyToken,upload.single('profile_picture'), updateUser);
router.delete('/:id', deleteUser);

export default router;