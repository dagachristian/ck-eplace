import fs from 'fs';
import path from 'path';

import { b8ToBMP, b8ToPNG, updBMPb8, updPNGb8 } from './canvasFunctions';

const out = 'test_output/';
beforeAll(() => fs.mkdirSync(path.resolve(__dirname, out), { recursive: true }))

describe('functions', () => {
  describe('canvas', () => {
    const vals = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,255];
    const buffer = Buffer.from(vals);
    let rgb: number[][] = []
    vals.forEach(v => {
      rgb.push([(v >> 5) * 32, ((v & 28) >> 2) * 32, (v & 3) * 64])
    })
    console.log(rgb)
    
    let png: Buffer;
    it('b8topng', () => {
      png = b8ToPNG(buffer);
      fs.writeFileSync(path.resolve(__dirname, out, 'out1.png'), png);
      expect(png[1]).toBe('P'.charCodeAt(0));
    })
    it('updpngb8', () => {
      const n = updPNGb8(png, 0, 0, 200);
      fs.writeFileSync(path.resolve(__dirname, out, 'out2.png'), n);
      expect(n[1]).toBe('P'.charCodeAt(0));
    })
    
    let bmp: Buffer;
    it('b8tobmp', () => {
      bmp = b8ToBMP(buffer);
      fs.writeFileSync(path.resolve(__dirname, out, 'out1.bmp'), bmp);
      expect(bmp[0]).toBe('B'.charCodeAt(0));
    })
    it('updbmpb8', () => {
      updBMPb8(bmp, 0, 0, 200);
      fs.writeFileSync(path.resolve(__dirname, out, 'out2.bmp'), bmp);
      expect(bmp[0]).toBe('B'.charCodeAt(0));
    })
  })
})