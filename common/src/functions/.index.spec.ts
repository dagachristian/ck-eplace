import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

import { b8ToPNG } from './canvasFunctions';

describe('functions', () => {
  it('bytetopng', () => {
    const vals = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    const ret = b8ToPNG(Buffer.from(vals));
    let out: number[][] = []
    vals.forEach(v => {
      out.push([(v >> 5) * 32, ((v & 28) >> 2) * 32, (v & 3) * 64])
    })
    console.log(out)
    const ri = PNG.sync.read(ret)
    const wi = PNG.sync.write(ri)
    fs.writeFileSync(path.resolve(__dirname, 'out.png'), wi);
    expect(ret).toBeInstanceOf(Buffer);
  })
})