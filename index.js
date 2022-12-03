const TIMEZONE_LIST = require("./data/tz.json");
const COARSE_WIDTH = 48;
const COARSE_HEIGHT = 24;
const FINE_WIDTH = 2;
const FINE_HEIGHT = 2;
const COARSE = COARSE_WIDTH * COARSE_HEIGHT;


const loadData = require('./lib/load-data');

let DATA;

const LEN = 65536 - TIMEZONE_LIST.length;

function tzlookup(lat, lon) {
  /* Make sure lat/lon are valid numbers. (It is unusual to check for the
   * negation of whether the values are in range, but this form works for NaNs,
   * too!) */
  lat = +lat;
  lon = +lon;
  if (!(lat >= -90.0 && lat <= +90.0 && lon >= -180.0 && lon <= +180.0)) {
    throw new RangeError("invalid coordinates");
  }

  /* The root node of the tree is wider than a normal node, acting essentially
   * as a "flattened" few layers of the tree. This saves a bit of overhead,
   * since the topmost nodes will probably all be full. */
  let x = (180.0 + lon) * COARSE_WIDTH / 360.00000000000006;

  let y = (90.0 - lat) * COARSE_HEIGHT / 180.00000000000003;
  let u = x | 0;
  let v = y | 0;
  let t = -1;
  let i = DATA[v * COARSE_WIDTH + u];

  /* Recurse until we hit a leaf node. */
  while (i < LEN) {
    x = ((x - u) % 1.0) * FINE_WIDTH;
    y = ((y - v) % 1.0) * FINE_HEIGHT;
    u = x | 0;
    v = y | 0;
    t = t + i + 1;
    i = DATA[COARSE + (t * FINE_HEIGHT + v) * FINE_WIDTH + u];
  }

  /* Once we hit a leaf, return the relevant timezone. */
  return TIMEZONE_LIST[i - LEN];
}

function init(fn) {
  loadData((err, data) => {
    DATA = data;
    fn(err);
  });
}

tzlookup.init = init;
module.exports = tzlookup;
