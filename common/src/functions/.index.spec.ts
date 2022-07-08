import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

import { b8ToBMP, b8ToPNG, updBMPb8, updPNGb8 } from './canvasFunctions';

describe('functions', () => {
  describe('canvas', () => {
    it('b8topng', () => {
      const vals = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
      const ret = b8ToPNG(Buffer.from(vals));
      let out: number[][] = []
      vals.forEach(v => {
        out.push([(v >> 5) * 32, ((v & 28) >> 2) * 32, (v & 3) * 64])
      })
      console.log(out)
      fs.writeFileSync(path.resolve(__dirname, 'out1.png'), ret);
      expect(ret).toBeInstanceOf(Buffer);
    })

    it('updpngb8', () => {
      const vals = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
      const o = b8ToPNG(Buffer.from(vals));
      const n = updPNGb8(o, 0, 0, 200);
      fs.writeFileSync(path.resolve(__dirname, 'out2.png'), n);
      expect(n).toBeInstanceOf(Buffer);
    })

    it('b8tobmp', () => {
      const vals = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
      const ret = b8ToBMP(Buffer.from(vals));
      fs.writeFileSync(path.resolve(__dirname, 'out1.bmp'), ret);
      expect(ret).toBeInstanceOf(Buffer);
    })

    it('updbmpb8', () => {
      const vals = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
      const o = b8ToBMP(Buffer.from(vals));
      updBMPb8(o, 0, 0, 200);
      fs.writeFileSync(path.resolve(__dirname, 'out2.bmp'), o);
      expect(o).toBeInstanceOf(Buffer);
    })
  })
})