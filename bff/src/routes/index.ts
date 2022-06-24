import express from 'express';

import accountRoutes from './accountRoutes';

const router = express.Router();

router.use('/account', accountRoutes);

export default router;