const fs = require("fs");
const path = require("path");

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

function fromFile(fn) {
  const filename = path.join(__dirname, '../data/tz.bin');
  fs.readFile(filename, (err, buffer) => {
    if (err) { return fn(err); }
    fn(null, fromBuffer(buffer));
  });
}

module.exports = fromFile;
