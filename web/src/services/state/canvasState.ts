import { canvasFnctns } from '@ck/common';

import { bffApi } from '../bffApi';

export let canvasBuf: Buffer;

export const getNewCanvas = async () => {
  canvasBuf = await bffApi.getCanvas();
}

export const updateCanvas = (x: number, y: number, color: number) => {
  canvasFnctns.updBMPb8(canvasBuf, x, y, color);
}