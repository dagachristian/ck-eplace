import express from 'express';

import userRoutes from './userRoutes';
import authRoutes from "./authRoutes";
import canvasRoutes from './canvasRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/canvas', canvasRoutes);

export default router;