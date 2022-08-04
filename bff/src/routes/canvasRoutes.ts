import express from 'express';

import { validate, canvasSchemas } from './validator';
import * as canvas from '../controllers/canvasController';

const router = express.Router();

router.route('/').get(validate({query: canvasSchemas.getCanvasesSch}), canvas.getCanvases);
router.route('/create').post(validate({body: canvasSchemas.createCanvasSch}), canvas.createCanvas);
router.route('/:canvasId').get(validate({params: canvasSchemas.canvasIdSch}), canvas.getCanvas);
router.route('/:canvasId').patch(validate({params: canvasSchemas.canvasIdSch}), canvas.updateCanvas);
router.route('/:canvasId').delete(validate({params: canvasSchemas.canvasIdSch}), canvas.deleteCanvas);
router.route('/:canvasId/sub').post(validate({params: canvasSchemas.canvasIdSch, query: canvasSchemas.subIdSch}), canvas.addSub);
router.route('/:canvasId/sub').delete(validate({params: canvasSchemas.canvasIdSch, query: canvasSchemas.subIdSch}), canvas.removeSub);

export default router;