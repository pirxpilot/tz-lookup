import fs from 'node:fs/promises';
import path from 'node:path';

function fromBuffer(buffer) {
  const len = buffer.length;
  const ab = new ArrayBuffer(len);
  let u = 0;

  const uints = new Uint16Array(ab);
  for (let i = 0; i < len; i += 2) {
    uints[u++] = buffer.readUInt16BE(i, false);
  }
  return uints;
}

export default function fromFile() {
  const filename = path.resolve(import.meta.dirname, '../data/tz.bin');
  return fs.readFile(filename).then(buffer => fromBuffer(buffer));
}
