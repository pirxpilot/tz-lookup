"use strict";
const fs            = require("fs"),
      path          = require("path");

const TIMEZONE_LIST = require("./tz.json"),
      COARSE_WIDTH  = 48,
      COARSE_HEIGHT = 24,
      FINE_WIDTH    = 2,
      FINE_HEIGHT   = 2;


function fromFile(path) {
  var buffer = fs.readFileSync(path);
  var len = buffer.length;
  var ab = new ArrayBuffer(len);

  var view = new Uint8Array(ab);

  for (var i = 0; i < len; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}

const DATA = new DataView(fromFile(path.join(__dirname, "./tz.bin")));

function at(index) {
  return DATA.getUint16(index, false);
}

const LEN = 65536 - TIMEZONE_LIST.length;

function tzlookup(lat, lon) {
  /* Make sure lat/lon are valid numbers. (It is unusual to check for the
   * negation of whether the values are in range, but this form works for NaNs,
   * too!) */
  lat = +lat;
  lon = +lon;
  if(!(lat >= -90.0 && lat <= +90.0 && lon >= -180.0 && lon <= +180.0)) {
    throw new RangeError("invalid coordinates");
  }

  /* The root node of the tree is wider than a normal node, acting essentially
   * as a "flattened" few layers of the tree. This saves a bit of overhead,
   * since the topmost nodes will probably all be full. */
  let x = (180.0 + lon) * COARSE_WIDTH  / 360.00000000000006,
      y = ( 90.0 - lat) * COARSE_HEIGHT / 180.00000000000003,
      u = x|0,
      v = y|0,
      t = -1,
      i = at((v * COARSE_WIDTH + u) * 2);

  /* Recurse until we hit a leaf node. */
  while(i < LEN) {
    x = ((x - u) % 1.0) * FINE_WIDTH;
    y = ((y - v) % 1.0) * FINE_HEIGHT;
    u = x|0;
    v = y|0;
    t = t + i + 1;
    i = at((COARSE_WIDTH * COARSE_HEIGHT + (t * FINE_HEIGHT + v) * FINE_WIDTH + u) * 2);
  }

  /* Once we hit a leaf, return the relevant timezone. */
  return TIMEZONE_LIST[i - LEN];
}

module.exports = tzlookup;
