import express from 'express';

import { validate, canvasSchemas } from './validator';
import * as canvas from '../controllers/canvasController';

const router = express.Router();

router.route('/').get(canvas.getCanvases);
router.route('/create').post(validate({body: canvasSchemas.createCanvasSch}), canvas.createCanvas);
router.route('/:canvasId').get(validate({params: canvasSchemas.getCanvasSch}), canvas.getCanvas);
router.route('/:canvasId').patch(canvas.updateCanvas);
router.route('/:canvasId').delete(canvas.deleteCanvas);
router.route('/:canvasId/sub').post(canvas.addSub);
router.route('/:canvasId/sub').delete(canvas.removeSub);

export default router;