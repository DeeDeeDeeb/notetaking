import express from 'express';
import { createUser, loginUser, getAllUsers } from '../controllers/noteController.js';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);

export default router;
