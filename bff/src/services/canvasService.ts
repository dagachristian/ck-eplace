import Query from '../db/Query';

export const fullCanvas = async (): Promise<Uint8Array> => {
  // use redis?
  let colors = await Query.findMany(
    { t: 'ck_canvas' }, { raw: true }
  );
  colors = colors.map((v: {color: number}) => v.color)
  console.log(colors);

  const arr = new Uint8Array(new ArrayBuffer(16));
  arr.set(colors);
  return arr;
}