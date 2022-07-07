import Query from '../db/Query';

export const fullCanvas = async (): Promise<Uint8Array> => {
  const vals = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

  const colors = await Query.findMany(
    { t: 'ck_canvas' }, { raw: true }
  );
  console.log(colors);

  const arr = new Uint8Array(new ArrayBuffer(16));
  arr.set(vals);
  return arr;
}