const fs = require('node:fs/promises');
const path = require('node:path');

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

function fromFile() {
  const filename = path.join(__dirname, '../data/tz.bin');
  return fs.readFile(filename).then(buffer => fromBuffer(buffer));
}

module.exports = fromFile;
