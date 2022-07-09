import express from 'express';

import * as canvas from '../controllers/canvasController';

const router = express.Router();

router.route('').get(canvas.getCanvas);

export default router;