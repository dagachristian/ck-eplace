import express from 'express';

import { validate, canvasSchemas } from './validator';
import * as canvas from '../controllers/canvasController';

const router = express.Router();

router.route('/:canvasId').get(validate({params: canvasSchemas.getCanvasSch}), canvas.getCanvas);
router.route('/create').post(validate({body: canvasSchemas.createCanvasSch}), canvas.createCanvas);

export default router;