import express from 'express';

import userRoutes from './userRoutes';
import authRoutes from "./authRoutes";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

export default router;