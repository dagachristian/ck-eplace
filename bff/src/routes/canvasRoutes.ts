import express from 'express';

import * as canvas from '../controllers/canvasController';

const router = express.Router();

router.route('/').get(canvas.getCanvas);
router.route('/image').get(canvas.getCanvasImage);

export default router;