import fs from 'fs';
import { PNG } from 'pngjs';

import { bytesToPNG } from './canvasFunctions';

describe('functions', () => {
  it('bytetopng', () => {
    const vals = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    const ret = bytesToPNG(vals);
    let out: number[][] = []
    vals.forEach(v => {
      out.push([(v >> 5) * 32, ((v & 28) >> 2) * 32, (v & 3) * 64])
    })
    console.log(out)
    expect(ret).toBeInstanceOf(Buffer);
  })
})